---
layout: post
category: ASP.NET
title: Implementing Key-Based and Basic Authentication in the same ASP.NET Core 9 Project
author: Saheb Ansari
authorRole: Software Engineer
date: 2024-12-07
image: "https://picsum.photos/960/320?random=11"
readingTime: "10 min read"
excerpt: "Learn how to implement both key-based and basic authentication in ASP.NET Core 9 to create versatile and secure API endpoints for different authentication scenarios."
---

## Introduction

In today's rapidly evolving digital landscape, securing web applications is paramount. Implementing robust authentication strategies is crucial to protect sensitive data and ensure authorized access. ASP.NET Core 9 provides versatile authentication methods, allowing developers to integrate multiple ways to authenticate users within a single project. This blog will guide you through implementing both key-based and basic authentication in ASP.NET Core 9, utilizing C# sample code for seamless integration. These methods, when combined, offer enhanced security solutions tailored to specific application needs.

## Understanding Authentication Mechanisms

Authentication is the process of identifying who a user is and ensuring that they are allowed to access the resources or operations they are requesting. In ASP.NET Core 9, authentication is achieved through middleware that intercepts HTTP requests and applies specific authentication logic. Two common mechanisms are key-based authentication, which involves API keys, and basic authentication, which uses user credentials like usernames and passwords.

**Key-Based Authentication:** This mechanism requires clients to include a secret key in their requests, enabling servers to verify the client's identity. It's often used in scenarios where non-user-based identification is needed, such as in API access for applications or services.

**Basic Authentication:** On the other hand, basic authentication is a simpler approach where users provide a username and password to access resources. It's straightforward but doesn't offer the strongest security, especially if used without encryption, since credentials are sent in base64 encoded format (not encrypted).

## Why Use Two Authentication Methods?

Imagine you have:

- An API that external systems access using an API key.
- Endpoints for users to log in with a username and password.

Instead of picking one method, why not use both? ASP.NET Core 9 supports multiple authentication schemes, so you can cater to diverse needs seamlessly.

## Getting Started

First, set up an ASP.NET Core 9 project. If you already have one, feel free to skip this part. Otherwise:

1. Open a terminal or Visual Studio.
2. Create a new web API project: `dotnet new webapi -n MultiAuthDemo`
3. Move to the project folder: `cd MultiAuthDemo`

## Step 1: Configure Authentication in Program.cs

In ASP.NET Core, the magic starts in `Program.cs`. Here, we'll register the two authentication schemes: Key-Based and Basic Authentication. Add the following code:

```csharp
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add authentication services
builder.Services.AddAuthentication()
    .AddScheme<KeyAuthenticationOptions, 
         KeyAuthenticationHandler>("KeyAuthentication", null)

    .AddScheme<BasicAuthenticationOptions, 
         BasicAuthenticationHandler>("BasicAuthentication", null);

// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("KeyPolicy", policy =>
        policy.AddAuthenticationSchemes("KeyAuthentication").RequireAuthenticatedUser());
    options.AddPolicy("BasicPolicy", policy =>
        policy.AddAuthenticationSchemes("BasicAuthentication").RequireAuthenticatedUser());
});

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

## Step 2: Key-Based Authentication

Key-Based Authentication requires clients to include a valid API key in the request header. Let's implement it step by step.

### Create Options for API Key

```csharp
using Microsoft.AspNetCore.Authentication;

public class KeyAuthenticationOptions : AuthenticationSchemeOptions
{
    public string ApiKey { get; set; } = "SuperSecretKey123";
}
```

### Create the Authentication Handler

```csharp
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;

public class KeyAuthenticationHandler : AuthenticationHandler<KeyAuthenticationOptions>
{
    public KeyAuthenticationHandler(
        IOptionsMonitor<KeyAuthenticationOptions> options,
        ILoggerFactory logger,
        System.Text.Encodings.Web.UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Api-Key", out var apiKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("API Key not found."));
        }

        if (apiKey != Options.ApiKey)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API Key."));
        }

        var claims = new[] { new Claim(ClaimTypes.Name, "ApiClient") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```

## Step 3: Basic Authentication

Now let's move to Basic Authentication. Here, clients send a username and password encoded in Base64.

### Create Basic Options

```csharp
using Microsoft.AspNetCore.Authentication;

public class BasicAuthenticationOptions : AuthenticationSchemeOptions
{
}
```

### Create the Authentication Handler

```csharp
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text;

public class BasicAuthenticationHandler : AuthenticationHandler<BasicAuthenticationOptions>
{
    public BasicAuthenticationHandler(
        IOptionsMonitor<BasicAuthenticationOptions> options,
        ILoggerFactory logger,
        System.Text.Encodings.Web.UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return Task.FromResult(AuthenticateResult.Fail("Authorization header is missing."));
        }

        var authHeader = Request.Headers["Authorization"].ToString();

        if (!authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header."));
        }

        var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
        var decodedBytes = Convert.FromBase64String(encodedCredentials);
        var credentials = Encoding.UTF8.GetString(decodedBytes).Split(':', 2);

        if (credentials.Length != 2 || credentials[0] != "testuser" || credentials[1] != "password123")
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid username or password."));
        }

        var claims = new[] { new Claim(ClaimTypes.Name, credentials[0]) };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```

## Step 4: Create Secured Endpoints

Finally, let's set up API endpoints to test both authentication methods.

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api")]
public class ApiController : ControllerBase
{
    [HttpGet("key-secure")]
    [Authorize(Policy = "KeyPolicy")]
    public IActionResult SecureWithKey()
    {
        return Ok(new { Message = "You accessed this using an API Key!" });
    }

    [HttpGet("basic-secure")]
    [Authorize(Policy = "BasicPolicy")]
    public IActionResult SecureWithBasic()
    {
        return Ok(new { Message = "You accessed this using Basic Authentication!" });
    }
}
```

## Step 5: Testing with Postman

### For API Key Authentication

1. Open Postman and create a `GET` request to: `https://localhost:5001/api/key-secure`
2. Under the Headers tab, add:
   - Key: `X-Api-Key`
   - Value: `SuperSecretKey123`
3. Hit Send.

Response: `{ "message": "You accessed this using an API Key!" }`

### For Basic Authentication

1. Create another `GET` request to: `https://localhost:5001/api/basic-secure`
2. Under the Authorization tab, select Basic Auth and fill in:
   - Username: `testuser`
   - Password: `password123`
3. Hit Send.

Response: `{ "message": "You accessed this using Basic Authentication!" }`

## Wrapping Up

And that's it! You now have an ASP.NET Core 9 project with both Key-Based and Basic Authentication running side by side. With just a few tweaks, you can customize this setup to fit your application's needs.

Keep coding and stay secure! 🚀
