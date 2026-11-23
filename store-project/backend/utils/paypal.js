const getPayPalBaseUrl = () => {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

const readResponse = async (response) => {
  const text = await response.text()

  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured")
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64")

  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  )

  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(
      data.error_description ||
      data.message ||
      "Failed to authenticate with PayPal"
    )
  }

  if (!data.access_token) {
    throw new Error("PayPal did not return an access token")
  }

  return data.access_token
}

const paypalRequest = async (
  endpoint,
  method = "GET",
  body = null
) => {
  const accessToken = await getPayPalAccessToken()

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }

  if (body !== null) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(
    `${getPayPalBaseUrl()}${endpoint}`,
    options
  )

  const data = await readResponse(response)

  if (!response.ok) {
    const issues = (data.details || [])
      .map((item) => {
        return `${item.issue || "Unknown issue"}: ${
          item.description || "No description"
        }`
      })
      .join(" | ")

    const errorMessage = [
      data.name || "PayPal API Error",
      data.message || "PayPal request failed",
      issues,
      data.debug_id ? `Debug ID: ${data.debug_id}` : "",
    ]
      .filter(Boolean)
      .join(" | ")

    const error = new Error(errorMessage)

    error.status = response.status
    error.paypalName = data.name
    error.paypalDetails = data.details || []
    error.paypalDebugId = data.debug_id

    throw error
  }

  return data
}

export {
  getPayPalAccessToken,
  paypalRequest,
}