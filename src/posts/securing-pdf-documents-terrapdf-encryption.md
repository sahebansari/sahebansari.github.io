---
layout: post
category: Programming
title: "Securing PDF Documents: AES-128 Encryption with TerraPDF vs Other Libraries"
author: Saheb Ansari
authorRole: Architect
date: 2026-05-23
image: "https://picsum.photos/960/320?random=73"
readingTime: "8 min read"
excerpt: "Build enterprise-grade encrypted PDFs with AES-128 protection, password controls, and fine-grained permissions in just 5 lines of code. See why TerraPDF beats iText, PdfSharp, and QuestPDF for secure document generation."
---

If you're generating confidential reports, financial statements, or sensitive invoices in .NET, you need encryption. PDFs with passwords. Restricted permissions. Copy-paste protection.

Most developers reach for **iText**, **PdfSharp**, or **QuestPDF**. They work, but they're heavyweight, require external dependencies, or lack clean APIs for permission control.

**TerraPDF changes this.** With just **5 lines**, you get enterprise-grade AES-128 encryption, user/owner passwords, and granular permission flags. No external libraries. No licensing concerns. Zero boilerplate.

## The Problem: PDF Encryption Is Messy

Standard PDF libraries make encryption tedious:

| Aspect | iText | PdfSharp | QuestPDF | TerraPDF |
|--------|-------|----------|----------|----------|
| **Lines to encrypt** | 15+ | 12+ | 8+ | **5** |
| **Permission control** | Complex flags | Unclear API | Basic | **Fine-grained** |
| **External dependencies** | Yes (bouncy-castle) | Yes | Optional | **No** |
| **Zero-dependency** | ❌ | ❌ | ❌ | ✅ |
| **AES-128 support** | ✅ | ✅ | ✅ | ✅ |

## The TerraPDF Way: 5 Lines to Encryption

```csharp
Document.Create(container =>
{
    container.Encrypt(new EncryptionOptions
    {
        UserPassword  = "confidential",    // Required to open
        OwnerPassword = "admin123",        // Bypass permissions
        Permissions   = PdfPermissions.Print | PdfPermissions.ExtractForAccessibility,
    });

    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        page.Content().Text("TOP SECRET FINANCIAL REPORT").Bold().FontSize(20);
        page.Content().Text("Encryption: AES-128 | User Password Protected");
    });
})
.PublishPdf("report.pdf");
```

**That's it.** The PDF opens in any viewer—Adobe Acrobat, Chrome, Edge, Firefox, Preview—with password protection enforced.

## Why This Matters: Permission Granularity

Traditional libraries offer generic "encrypt yes/no" options. TerraPDF gives you **fine-grained control**:

```csharp
// View-only: No printing, no copying
container.Encrypt(new EncryptionOptions
{
    UserPassword = "readonly",
    Permissions = PdfPermissions.None,
});

// Allow printing, but not copying or modification
container.Encrypt(new EncryptionOptions
{
    UserPassword = "print_only",
    Permissions = PdfPermissions.Print,
});

// Restrict all except text extraction for accessibility
container.Encrypt(new EncryptionOptions
{
    UserPassword = "access_friendly",
    Permissions = PdfPermissions.ExtractForAccessibility,
});

// Full encryption, no user password, owner-only control
container.Encrypt(new EncryptionOptions
{
    OwnerPassword = "admin",
    Permissions = PdfPermissions.None,   // Viewer opens unlocked but can't print/copy
});
```

**Permission flags available:**
- `Print` — Allow high-quality printing
- `PrintLowResolution` — Degraded printing only
- `CopyText` — Allow copy/paste of text and graphics
- `ModifyContents` — Allow document editing
- `ModifyAnnotations` — Add/modify annotations
- `FillForms` — Fill form fields
- `ExtractForAccessibility` — Screen reader text extraction
- `AssembleDocument` — Insert/rotate/delete pages
- `All` — Unrestricted
- `None` — View-only

## Real-World Use Cases

### Scenario 1: Confidential Invoices
```csharp
public byte[] GenerateConfidentialInvoice(Invoice inv)
{
    return Document.Create(container =>
    {
        // Restrict to view and print only—no copying invoice numbers
        container.Encrypt(new EncryptionOptions
        {
            UserPassword = $"inv_{inv.Number}",  // Generate per invoice
            Permissions = PdfPermissions.Print,
        });

        container.Page(page =>
        {
            page.Content().Text($"Invoice #{inv.Number}").Bold().FontSize(18);
            page.Content().Table(t => BuildInvoiceTable(t, inv));
        });
    })
    .PublishPdf();
}
```

### Scenario 2: Internal Reports (Admin-Protected)
```csharp
var reportPdf = Document.Create(container =>
{
    container.Encrypt(new EncryptionOptions
    {
        OwnerPassword = "C0rp_Admin!2025",   // Only admins can remove restrictions
        UserPassword = null,                  // Opens without password
        Permissions = PdfPermissions.Print,  // Users can only print
    });

    container.Page(page =>
    {
        page.Content().Text("Q1 2025 Financial Summary");
        page.Content().Text("⚠️ Confidential — Print-only, no copy/export allowed");
    });
})
.PublishPdf("q1-report.pdf");
```

### Scenario 3: Public PDFs with Accessibility
```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "open",
    Permissions = PdfPermissions.ExtractForAccessibility | PdfPermissions.Print,
});
// Users can print and screen readers can extract text,
// but copy-paste from the document is blocked
```

## Under the Hood: Enterprise-Grade Encryption

TerraPDF doesn't cut corners on security:

**Algorithm:**
- **Cipher:** AES-128 CBC (industry standard)
- **Key derivation:** MD5 + 50 rounds (per PDF spec §7.6.3.3)
- **IV:** 16-byte random per object
- **Revision:** 4 (PDF 1.6 compatible)

**What gets encrypted:**
- ✅ Content streams (page drawing operators)
- ✅ Images (PNG/JPEG pixel data)
- ✅ All objects use unique per-object keys

**What doesn't (per PDF spec):**
- Metadata dictionary
- Cross-reference table
- File header

**Zero external dependencies** — uses only `System.Security.Cryptography`:
- `Aes` for content encryption
- `MD5` for PDF-mandated key derivation
- `RandomNumberGenerator` for IV generation

## Comparison: iText vs PdfSharp vs QuestPDF vs TerraPDF

### iText Example (boilerplate-heavy)
```csharp
using iText.Kernel.Pdf;

// Requires external license or AGPL compliance
PdfDocument pdfDocument = new PdfDocument(
    new PdfWriter("document.pdf", 
        new WriterProperties()
            .SetStandardEncryption(
                "userpass".GetBytes(Encoding.UTF8),
                "ownerpass".GetBytes(Encoding.UTF8),
                EncryptionConstants.ALLOW_PRINTING,
                EncryptionConstants.STANDARD_ENCRYPTION_128)));

Document doc = new Document(pdfDocument);
doc.Add(new Paragraph("Hello World"));
doc.Close();
```

**Downsides:**
- Complex license (AGPL for open source)
- External dependency (BouncyCastle)
- Verbose flag setup
- 15+ lines for basic encryption

### PdfSharp Example (clunky API)
```csharp
using PdfSharp.Pdf;
using PdfSharp.Pdf.Security;

PdfDocument document = new PdfDocument();
document.SecuritySettings.UserPassword = "user";
document.SecuritySettings.OwnerPassword = "owner";
document.SecuritySettings.PermitAccessibilityExtractContent = true;
document.SecuritySettings.PermitAssembleDocument = false;
document.SecuritySettings.PermitChangeDocument = false;
document.SecuritySettings.PermitCopy = false;
document.SecuritySettings.PermitEditAnnotations = false;
document.SecuritySettings.PermitFillIn = false;
document.SecuritySettings.PermitModifyDocument = false;
document.SecuritySettings.PermitPrint = true;

PdfPage page = document.AddPage();
// ... drawing code
document.Save("document.pdf");
```

**Downsides:**
- Verbose property assignments
- No fluent API
- Unclear permission semantics
- 12+ lines of config

### QuestPDF Example (decent, but limited)
```csharp
Document.Create(container =>
{
    // QuestPDF has basic encryption support
    // but less fine-grained control than TerraPDF
    
    container.Page(page =>
    {
        page.Size(PageSizes.A4);
        page.Content().Text("Encrypted Document");
    });
})
.GeneratePdf("document.pdf");
// Encryption config is limited compared to TerraPDF
```

**Downsides:**
- Limited permission control
- Generic encryption model
- Less flexibility than TerraPDF

### TerraPDF (clean, fluent, zero-dependency)
```csharp
Document.Create(container =>
{
    container.Encrypt(new EncryptionOptions
    {
        UserPassword = "open123",
        OwnerPassword = "admin456",
        Permissions = PdfPermissions.Print | PdfPermissions.CopyText,
    });

    container.Page(page =>
    {
        page.Content().Text("Secure Document");
    });
})
.PublishPdf("document.pdf");
```

**Advantages:**
- ✅ **5 lines** of encryption config
- ✅ Fluent, readable API
- ✅ Fine-grained permission flags
- ✅ **Zero external dependencies**
- ✅ MIT license
- ✅ No vendor lock-in
- ✅ All major PDF viewers supported

## Common Encryption Patterns

### View-Only (No Printing or Copying)
```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "readonly",
    Permissions = PdfPermissions.None,
});
```

### Print-Only (No Copying or Editing)
```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "print_only",
    Permissions = PdfPermissions.Print,
});
```

### Owner Password Only (No User Password)
```csharp
container.Encrypt(new EncryptionOptions
{
    OwnerPassword = "admin_only",
    Permissions = PdfPermissions.None,
});
// Document opens freely but can't be printed/copied without owner password
```

### Full Encryption, All Permissions
```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "secret",
    Permissions = PdfPermissions.All,
});
// Content encrypted but full interactivity allowed
```

## Integration Pattern: Reusable Encryption Component

```csharp
public class SecureDocument : IComponent
{
    private readonly PdfSecurityLevel _level;
    private readonly string _title;

    public SecureDocument(string title, PdfSecurityLevel level)
    {
        _title = title;
        _level = level;
    }

    public void Compose(IContainer container)
    {
        // Apply encryption based on security level
        container.Encrypt(GetEncryptionOptions(_level));

        container.Page(page =>
        {
            page.Content().Text(_title).Bold().FontSize(20);
            page.Content().Text($"Security Level: {_level}");
        });
    }

    private EncryptionOptions GetEncryptionOptions(PdfSecurityLevel level) => level switch
    {
        PdfSecurityLevel.Public => new() 
        { 
            Permissions = PdfPermissions.All 
        },
        PdfSecurityLevel.Internal => new() 
        { 
            UserPassword = "internal",
            Permissions = PdfPermissions.Print | PdfPermissions.ExtractForAccessibility
        },
        PdfSecurityLevel.Confidential => new() 
        { 
            UserPassword = "confidential",
            OwnerPassword = "admin_override",
            Permissions = PdfPermissions.Print
        },
        _ => throw new ArgumentException("Unknown security level"),
    };
}

public enum PdfSecurityLevel { Public, Internal, Confidential }

// Usage
Document.Create(new SecureDocument("Financial Report", PdfSecurityLevel.Confidential))
    .PublishPdf("report.pdf");
```

## Technical FAQ

**Q: Is AES-128 strong enough?**
A: Yes. AES-128 is approved by NIST and used by government agencies. For standard business documents, it's industry standard. PDF 2.0 also supports AES-256, but PDF 1.7 (TerraPDF's version) uses AES-128.

**Q: Can users bypass the encryption?**
A: No. The user password is required to open. The owner password bypasses **permission flags** (printing, copying) but the document remains encrypted. There's no "password bypass" mode.

**Q: Do all PDF viewers support TerraPDF encryption?**
A: Yes. Adobe Acrobat, Chrome, Edge, Firefox, Preview (Mac), Foxit, Okular, and nearly all viewers support the PDF 1.7 Standard Security Handler (Revision 4) that TerraPDF uses.

**Q: Can I generate a per-user password?**
A: Yes. Generate passwords dynamically:
```csharp
var userPassword = $"user_{invoice.CustomerId}_{DateTime.Now:yyyyMMdd}";
container.Encrypt(new EncryptionOptions { UserPassword = userPassword });
```

**Q: What if I only want to encrypt but not require a password?**
A: Leave `UserPassword` null and set `OwnerPassword`. The document opens freely but permissions are enforced.

## Why Choose TerraPDF for Encryption

1. **5-line setup** — Clean, fluent API
2. **Zero dependencies** — No external packages or native binaries
3. **Fine-grained permissions** — 8 distinct permission flags
4. **Production-ready** — Enterprise AES-128 encryption
5. **MIT licensed** — No licensing restrictions
6. **Universal compatibility** — Works in every PDF viewer
7. **Fast** — Pure C# with no external calls
8. **Maintainable** — Easy to read, test, and update

## Conclusion

If you're building .NET applications that generate confidential PDFs—financial reports, invoices, legal documents, medical records—you need encryption.

**TerraPDF delivers it with less code, fewer dependencies, and more control than iText, PdfSharp, or QuestPDF.**

5 lines. AES-128. All major viewers. MIT license. Zero external packages.

That's the TerraPDF difference.

**Get started:**
```bash
dotnet add package TerraPDF
```

**Documentation:**
- [TerraPDF Encryption Docs](https://github.com/sahebansari/TerraPDF/blob/master/docs/encryption.md)
- [GitHub Repository](https://github.com/sahebansari/TerraPDF)
- [Website: terrapdf.com](https://terrapdf.com/)
