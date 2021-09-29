const pointsToFile = uri => /\/[^/]+\.[^/]+$/.test(uri)
const hasTrailingSlash = uri => uri.endsWith('/')
const needsTrailingSlash = uri => !pointsToFile(uri) && !hasTrailingSlash(uri)
const bucketName = 'wc-staging-demos'
const subDomain = 'wc-staging'


exports.LambdaHandler = async (event, context, callback) => {
  let request = event.Records[0].cf.request
  let host = request.headers.host[0].value
  const olduri = request.uri
  const qs = request.querystring

  // If needed, redirect to the same URI with
  // trailing slash, keeping query string.
  if (needsTrailingSlash(olduri)) {
    return callback(null, {
      body: '',
      status: '302',
      statusDescription: 'Moved Temporarily',
      headers: {
        location: [{
          key: 'Location',
          value: qs ? `${olduri}/?${qs}` : `${olduri}/`,
        }],
      }
    })
  }

  host = host.replace(/^www\./, "")
  host = host.replace(/(^\w+:|^)\/\//, '')

  // If it has a subdomain, get the path to the directory where the
  // React app's static files are stored based on the subdomain's
  // identifier (marketing, support, portal).
  // If it doesn't have a subdomain, there will be no need for a path
  // because the static files will be at the root of the bucket, so
  // return an empty string.
  const subdomainPattern = `[a-zA-Z0-9-_]+\.${subDomain}\.design\.infor\.com`
  const re = new RegExp(subdomainPattern, 'g')
  const dir = re.test(host) ? host.split(".")[0] : undefined
  const entryPoint = dir ? `/${dir}` : ""

  // Declare the website endpoint of your Custom Origin.
  const domain = `${bucketName}.s3-website-us-east-1.amazonaws.com`

  // Instruct to send the request to the S3 bucket, specifying for it
  // to look for content within the sub-directory or at the root.
  // The key here is the 'path' property. It specifies the entry point.
  // It does not affect the request URI (eg. /login). 
  request.origin = {
    custom: {
      domainName: domain,
      port: 80,
      protocol: "http",
      path: entryPoint,
      sslProtocols: ["TLSv1.1", "TLSv1.2"],
      readTimeout: 5,
      keepaliveTimeout: 5,
      customHeaders: {
        // Set a referer request header to gain access to read objects in the S3 bucket.
        referer: [{ key: "referer", value: `http://${host}/` }]
      }
    }
  }

  request.headers["host"] = [{ key: "host", value: domain }]
  callback(null, request)
}
