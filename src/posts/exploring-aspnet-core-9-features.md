---
layout: post
category: ASP.NET
title: Exploring the Unique Features of ASP.NET Core 9 - A Comprehensive Guide with Examples
author: Saheb Ansari
authorRole: Software Engineer
date: 2024-11-30
image: "https://picsum.photos/960/320?random=15"
readingTime: "12 min read"
excerpt: "Discover the unique and powerful features of ASP.NET Core 9 that enhance developer productivity, performance, and modern web application development capabilities."
---

ASP.NET Core 9, the latest iteration of Microsoft's robust web framework, brings a plethora of enhancements aimed at improving developer productivity, performance, and the overall experience of building modern web applications. This article will highlight the most intriguing features of ASP.NET Core 9, complete with example code to demonstrate their capabilities.

## 1. Native Support for Blazor Hybrid Apps

With ASP.NET Core 9, Blazor apps can now seamlessly integrate with native desktop and mobile platforms. This feature allows developers to share UI components across web and native platforms.

### Example: Blazor Component for Both Web and Native

```razor
<h1>Hello, Blazor Hybrid!</h1>
<p>This component works on both web and native platforms.</p>
```

To use this component in a hybrid app:
- Add it to a .razor file in your project.
- Use it in a web or native application via the same Razor syntax.

## 2. Improved Minimal APIs

Minimal APIs have been further enhanced in ASP.NET Core 9, making it easier than ever to build lightweight services.

### Example: Minimal API with OpenAPI Documentation

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/hello", () => Results.Ok("Hello, World!"))
   .WithName("GetHello")
   .WithOpenApi(); // Automatically generates OpenAPI documentation

app.Run();
```

Now, by running your app, OpenAPI documentation will be generated and available at `/swagger`.

## 3. Enhanced Middleware Pipelines

Middleware is at the heart of ASP.NET Core, and the latest version provides more flexibility, including middleware chaining with better error handling.

### Example: Conditional Middleware Execution

```csharp
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/admin")
    {
        await context.Response.WriteAsync("Admin Access Only");
    }
    else
    {
        await next();
    }
});
app.MapGet("/", () => "Welcome to ASP.NET Core 9!");
```

## 4. Performance Improvements with Native AOT

ASP.NET Core 9 introduces Native Ahead-Of-Time (AOT) compilation, which dramatically improves the performance of your apps by precompiling them into optimized machine code.

### Example: Enabling Native AOT

In your project file:

```xml
<PropertyGroup>
  <PublishAot>true</PublishAot>
</PropertyGroup>
```

Publish your app using:

```bash
dotnet publish -c Release
```

## 5. SignalR Enhancements

SignalR has received updates for better real-time communication, including reduced latency and extended protocol support.

### Example: Simple SignalR Setup

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapHub<ChatHub>("/chat");

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}

app.Run();
```

On the client side, use JavaScript or .NET to connect to `/chat`.

## 6. Cross-Origin Resource Sharing (CORS) Improvements

CORS is more configurable in ASP.NET Core 9, allowing granular control over cross-origin requests.

### Example: Configuring CORS

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("https://example.com")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

app.UseCors("AllowSpecificOrigin");
app.MapGet("/", () => "CORS Configured!");
```

## 7. Modernized Dependency Injection

ASP.NET Core 9 introduces better ways to register and resolve services, including dynamic service providers.

### Example: Registering Services

```csharp
builder.Services.AddSingleton<IMyService, MyService>();

public interface IMyService
{
    string GetData();
}

public class MyService : IMyService
{
    public string GetData() => "Hello from MyService!";
}

app.MapGet("/service", (IMyService service) => service.GetData());
```

## Conclusion

ASP.NET Core 9 continues to set the benchmark for web development frameworks by combining performance, simplicity, and versatility. Whether you're building a simple API or a complex hybrid application, these features enable you to deliver high-quality solutions efficiently.
