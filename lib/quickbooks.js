import OAuthClient from 'intuit-oauth';

// QuickBooks OAuth Client Configuration
// Note: QuickBooks integration is optional. If credentials not provided, QB features will be disabled.
const oauthClient = process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET 
  ? new OAuthClient({
      clientId: process.env.QUICKBOOKS_CLIENT_ID,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
      environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
      redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
    })
  : null;

// Get authorization URL
export function getAuthUri() {
  return oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
    state: 'balajee-trade-link-state',
  });
}

// Exchange authorization code for tokens
export async function getTokensFromCode(code, realmId) {
  try {
    const authResponse = await oauthClient.createToken(code);
    return {
      accessToken: authResponse.token.access_token,
      refreshToken: authResponse.token.refresh_token,
      realmId: realmId,
      expiresAt: new Date(Date.now() + authResponse.token.expires_in * 1000),
    };
  } catch (error) {
    console.error('QuickBooks token exchange error:', error);
    throw error;
  }
}

// Refresh access token
export async function refreshAccessToken(refreshToken) {
  try {
    oauthClient.setToken({ refresh_token: refreshToken });
    const authResponse = await oauthClient.refresh();
    return {
      accessToken: authResponse.token.access_token,
      refreshToken: authResponse.token.refresh_token,
      expiresAt: new Date(Date.now() + authResponse.token.expires_in * 1000),
    };
  } catch (error) {
    console.error('QuickBooks token refresh error:', error);
    throw error;
  }
}

// Check if product exists in QuickBooks inventory
export async function checkInventoryInQuickBooks(sku, accessToken, realmId) {
  try {
    oauthClient.setToken({ access_token: accessToken });
    
    const companyId = realmId;
    const query = `SELECT * FROM Item WHERE Sku = '${sku}' AND Active = true`;
    
    const response = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(query)}`,
    });
    
    const items = response.json.QueryResponse.Item;
    
    if (items && items.length > 0) {
      return {
        exists: true,
        itemId: items[0].Id,
        name: items[0].Name,
        quantityOnHand: items[0].QtyOnHand || 0,
        unitPrice: items[0].UnitPrice || 0,
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('QuickBooks inventory check error:', error);
    return { exists: false, error: error.message };
  }
}

// Create or update customer in QuickBooks
export async function syncCustomerToQuickBooks(customerData, accessToken, realmId) {
  try {
    oauthClient.setToken({ access_token: accessToken });
    
    const companyId = realmId;
    
    // Check if customer exists
    const query = `SELECT * FROM Customer WHERE PrimaryEmailAddr = '${customerData.email}'`;
    const searchResponse = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(query)}`,
    });
    
    const existingCustomers = searchResponse.json.QueryResponse.Customer;
    
    if (existingCustomers && existingCustomers.length > 0) {
      // Customer exists, return ID
      return {
        success: true,
        customerId: existingCustomers[0].Id,
        action: 'existing',
      };
    }
    
    // Create new customer
    const customerPayload = {
      DisplayName: customerData.company || customerData.name,
      PrimaryEmailAddr: { Address: customerData.email },
      GivenName: customerData.name.split(' ')[0],
      FamilyName: customerData.name.split(' ').slice(1).join(' '),
      CompanyName: customerData.company,
    };
    
    const createResponse = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/customer`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerPayload),
    });
    
    return {
      success: true,
      customerId: createResponse.json.Customer.Id,
      action: 'created',
    };
  } catch (error) {
    console.error('QuickBooks customer sync error:', error);
    return { success: false, error: error.message };
  }
}

// Create invoice in QuickBooks
export async function createInvoiceInQuickBooks(orderData, accessToken, realmId) {
  try {
    oauthClient.setToken({ access_token: accessToken });
    
    const companyId = realmId;
    
    // Prepare line items
    const lineItems = orderData.items.map((item, index) => ({
      DetailType: 'SalesItemLineDetail',
      Amount: item.price * item.quantity,
      SalesItemLineDetail: {
        ItemRef: {
          value: item.quickbooksItemId || '1', // Default item if not found
        },
        UnitPrice: item.price,
        Qty: item.quantity,
      },
      LineNum: index + 1,
      Description: item.name,
    }));
    
    // Add shipping as a line item if exists
    if (orderData.shippingCharge && orderData.shippingCharge > 0) {
      lineItems.push({
        DetailType: 'SalesItemLineDetail',
        Amount: orderData.shippingCharge,
        SalesItemLineDetail: {
          ItemRef: {
            value: 'SHIPPING_ITEM_ID', // Replace with your shipping item ID in QuickBooks
          },
          UnitPrice: orderData.shippingCharge,
          Qty: 1,
        },
        Description: 'Shipping Charges',
      });
    }
    
    const invoicePayload = {
      CustomerRef: {
        value: orderData.quickbooksCustomerId,
      },
      Line: lineItems,
      DocNumber: orderData.orderId,
      TxnDate: new Date(orderData.createdAt).toISOString().split('T')[0],
      DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days net
      PrivateNote: `Order ID: ${orderData.orderId}`,
    };
    
    const response = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/invoice`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoicePayload),
    });
    
    return {
      success: true,
      invoiceId: response.json.Invoice.Id,
      invoiceNumber: response.json.Invoice.DocNumber,
    };
  } catch (error) {
    console.error('QuickBooks invoice creation error:', error);
    return { success: false, error: error.message };
  }
}

// Update invoice in QuickBooks (after order modifications)
export async function updateInvoiceInQuickBooks(invoiceId, orderData, accessToken, realmId) {
  try {
    oauthClient.setToken({ access_token: accessToken });
    
    const companyId = realmId;
    
    // First, get the existing invoice to get sync token
    const getResponse = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/invoice/${invoiceId}`,
    });
    
    const existingInvoice = getResponse.json.Invoice;
    
    // Prepare updated line items
    const lineItems = orderData.items.map((item, index) => ({
      Id: index + 1,
      DetailType: 'SalesItemLineDetail',
      Amount: item.price * item.quantity,
      SalesItemLineDetail: {
        ItemRef: {
          value: item.quickbooksItemId || '1',
        },
        UnitPrice: item.price,
        Qty: item.quantity,
      },
      LineNum: index + 1,
      Description: item.name,
    }));
    
    // Add shipping if exists
    if (orderData.shippingCharge && orderData.shippingCharge > 0) {
      lineItems.push({
        DetailType: 'SalesItemLineDetail',
        Amount: orderData.shippingCharge,
        SalesItemLineDetail: {
          ItemRef: {
            value: 'SHIPPING_ITEM_ID',
          },
          UnitPrice: orderData.shippingCharge,
          Qty: 1,
        },
        Description: 'Shipping Charges',
      });
    }
    
    const updatePayload = {
      ...existingInvoice,
      Line: lineItems,
      sparse: true, // Only update specified fields
    };
    
    const response = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/invoice`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    
    return {
      success: true,
      invoiceId: response.json.Invoice.Id,
      invoiceNumber: response.json.Invoice.DocNumber,
    };
  } catch (error) {
    console.error('QuickBooks invoice update error:', error);
    return { success: false, error: error.message };
  }
}

// Get all items from QuickBooks (for inventory sync)
export async function getAllItemsFromQuickBooks(accessToken, realmId) {
  try {
    oauthClient.setToken({ access_token: accessToken });
    
    const companyId = realmId;
    const query = 'SELECT * FROM Item WHERE Active = true MAXRESULTS 1000';
    
    const response = await oauthClient.makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(query)}`,
    });
    
    const items = response.json.QueryResponse.Item || [];
    
    return {
      success: true,
      items: items.map(item => ({
        id: item.Id,
        sku: item.Sku,
        name: item.Name,
        quantity: item.QtyOnHand || 0,
        price: item.UnitPrice || 0,
      })),
    };
  } catch (error) {
    console.error('QuickBooks items fetch error:', error);
    return { success: false, error: error.message };
  }
}

export default {
  getAuthUri,
  getTokensFromCode,
  refreshAccessToken,
  checkInventoryInQuickBooks,
  syncCustomerToQuickBooks,
  createInvoiceInQuickBooks,
  updateInvoiceInQuickBooks,
  getAllItemsFromQuickBooks,
};
