---
layout: post
category: Technology
title: "Are you TLS 1.2 ready? Force your secure Web API to use TLS 1.2"
author: Saheb Ansari
authorRole: Software Engineer
date: 2024-11-09
image: "https://picsum.photos/1200/400?random=17"
readingTime: "5 min read"
excerpt: "Learn how to upgrade your web APIs to use TLS 1.2 security protocol and fix connection errors caused by TLS version mismatches with modern browsers."
---

## What is TLS?

Transport Layer Security (TLS) is an industry security standard to help protect data transmitted over the internet. The newest version of TLS, 1.2 provides enhanced security and it is the current standard.

## .NET Framework & TLS

The .NET framework uses common language runtime, used as an execution engine and class library providing reusable code. Older versions of .NET do not support the newer TLS 1.2 so it is recommended to also upgrade .NET to at least 4.5 if you are using an older version of Windows. The .NET 4.5 supports TLS 1.2 but it is not the default protocol so you need to opt-in to use the latest TLS 1.2.

## Forcing a Secure Website and Web API to Use TLS 1.2

With the recent upgrade of TLS 1.0 and 1.1 to TLS 1.2, older TLS 1.0 and TLS 1.1 are now deprecated. So, you have to force your websites and services to run over TLS 1.2.

### The Problem

You might get the below error due to TLS upgrade. The latest browsers by default will make a call to service (API) using TLS1.2 and your API will not accept the request with the new TLS version. So to fix this issue you have to force your API to accept the request with new TLS 1.2 version.

**Error:**

```
GET - An unhandled exception occurred. 
System.InvalidOperationException: An error occurred while processing this request.
--->
Microsoft.OData.Client.DataServiceTransportException: The underlying connection was closed: 
An unexpected error occurred on a send. 
--->
System.Net.WebException: The underlying connection was closed: 
An unexpected error occurred on a send. 
--->
System.IO.IOException: Unable to read data from the transport connection: 
An existing connection was forcibly closed by the remote host. 
--->
System.Net.Sockets.SocketException: An existing connection was forcibly closed by the remote host
```

### The Solution

To fix this issue, add the following lines to your `global.asax` file:

```csharp
protected void Application_Start()  
{  
     ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls 
                | SecurityProtocolType.Tls11 
                | SecurityProtocolType.Tls12;  
}
```

This configuration tells your application to support TLS 1.0, 1.1, and 1.2, ensuring compatibility with modern browsers and services that require TLS 1.2.

## Best Practice

While supporting multiple TLS versions maintains backward compatibility, it's recommended to eventually deprecate older versions and move exclusively to TLS 1.2 or higher for enhanced security. Make sure your infrastructure, clients, and servers are all aligned on the latest TLS versions to maintain the highest security standards.
