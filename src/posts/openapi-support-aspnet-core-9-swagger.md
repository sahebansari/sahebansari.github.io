---
layout: post
category: ASP.NET
title: OpenAPI Support in ASP.NET Core 9 and Using Swagger UI for API Documentation
author: Saheb Ansari
authorRole: Software Engineer
date: 2024-12-21
image: "https://picsum.photos/960/320?random=10"
readingTime: "8 min read"
excerpt: "Learn how to leverage OpenAPI in ASP.NET Core 9 and use Swagger UI to create comprehensive and interactive API documentation for your web applications."
---

## Introduction

Hey there, fellow developers! If you're diving into the world of web development, you know how important it is to have well-documented APIs. ASP.NET Core 9 has got your back with enhanced support for OpenAPI, making it super easy to document your Web APIs. In this post, we'll walk you through how to leverage OpenAPI in ASP.NET Core 9 and use Swagger UI to create awesome API documentation.

## What is OpenAPI?

First things first, let's talk about OpenAPI. Formerly known as Swagger, OpenAPI is a specification for building APIs. It helps you define your APIs in a standardized format, making them easier to understand, test, and integrate with other systems. Think of it as a blueprint for your API, detailing its structure, endpoints, request/response formats, and authentication methods.

## Setting Up ASP.NET Core 9

Ready to get started? Make sure you have the latest version of the .NET SDK installed. You can create a new ASP.NET Core 9 project with this command:

```bash
dotnet new webapi -minimal -n MyApiProject
cd MyApiProject
```

## Adding OpenAPI Support

ASP.NET Core 9 comes with built-in support for OpenAPI. To enable it, you'll need to add the `Microsoft.AspNetCore.OpenApi` package to your project. Just run:

```bash
dotnet add package Microsoft.AspNetCore.OpenApi
```

Next, open the `Program.cs` file and configure OpenAPI in the `ConfigureServices` and `Configure` methods:

```csharp
var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
// The above two lines are not needed with ASP.Net Core 9 

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.UseSwagger(); This is also not needed now. Instead use function MapOpenApi()
    app.MapOpenApi("OpenApi/v1/OpenApiDoc.json");
    app.UseSwaggerUI(c =>
    {
     c.SwaggerEndpoint("/OpenApi/v1/OpenApiDoc.json", "My API Documentation V1");
    }
  
}

app.UseHttpsRedirection();

var apiGroup = app.MapGroup("/api");

apiGroup.MapGet("/greet", () => "Hello, World!")
    .WithName("Greet")
    .WithDescription("Returns a greeting message.");

app.Run();
```

## Using Swagger UI

Swagger UI is a fantastic tool that automatically generates interactive API documentation from your OpenAPI specification. With Swagger UI, you can visualize and test your API endpoints right from your browser.

To check it out, run your application and navigate to `http://localhost:5000` (or the appropriate URL for your setup). You'll see a user-friendly interface displaying your API endpoints, request/response formats, and other details.

## Customizing Swagger UI

Want to make Swagger UI your own? You can customize its appearance and behavior by tweaking the `SwaggerUIOptions` in the `Configure` method. For example, you can change the theme, add custom CSS, or enable deep linking:

```csharp
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/OpenApi/v1/OpenApiDoc.json", "My API Documentation V1");
    c.RoutePrefix = "OpenApiDoc";
    c.DocumentTitle = "My Custom API Documentation";
    c.InjectStylesheet("/swagger-ui/custom.css");
    c.EnableDeepLinking();
});
```

### What is `EnableDeepLinking()`?

The `EnableDeepLinking()` function in Swagger UI is a nifty feature that allows you to enable deep linking for tags and operations. This means each tag and operation in your API documentation will have a unique URL that can be bookmarked and shared. When you navigate to a specific tag or operation using its URL, Swagger UI will automatically expand and highlight the corresponding section. This is super handy for large APIs, as it lets users quickly access and share specific parts of the documentation.

## Providing Descriptions for Endpoints

In Minimal APIs, you can provide descriptions for your endpoints using the `WithDescription` method. This method lets you add a brief description of what the endpoint does, which will be displayed in the Swagger UI. For example:

```csharp
apiGroup.MapGet("/greet", () => "Hello, World!")
    .WithName("Greet")
    .WithDescription("Returns a greeting message.");
```

These descriptions help users understand the purpose of each endpoint and how to use them effectively.

## Launch Settings for Swagger UI

To automatically open Swagger UI when you run your project, you can configure the launch settings in the `launchSettings.json` file. Here's how you can do it:

1. Open the `Properties` folder in your project.
2. Open the `launchSettings.json` file.
3. Add the following configuration under the `profiles` section:

```json
{
  "profiles": {
    "MyApiProject": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "OpenApiDoc",
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

## Conclusion

OpenAPI support in ASP.NET Core 9, combined with Swagger UI, provides a powerful and user-friendly way to document your Web APIs. By following the steps outlined in this blog post, you can create comprehensive and interactive API documentation that will benefit both developers and users.

Happy coding! 😊
