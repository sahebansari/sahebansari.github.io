---
layout: post
category: .NET
title: "Introducing TerraFluent: One Fluent API for PDF, HTML & DOCX Reports in .NET"
author: Saheb Ansari
authorRole: Architect
date: 2026-07-25
image: "https://picsum.photos/960/320?random=88"
readingTime: "10 min read"
excerpt: "TerraFluent is my new family of zero-dependency .NET libraries that generate PDF, HTML, and DOCX reports from one consistent fluent API — barcodes, real Word charts, AES-256 encryption, and smart pagination included. MIT licensed, no watermarks, no page limits."
---

Every .NET team eventually hits the same wall: they need to generate documents. An invoice as a PDF. A dashboard export as HTML. A quarterly report as an editable Word file. And almost every time, that turns into three different libraries, three different mental models, a pile of native dependencies, and — more often than you'd like — a licensing invoice.

I got tired of that wall. So I built **[TerraFluent](https://terrafluent.dev/)**: a small family of .NET reporting libraries that produce **PDF, HTML, and DOCX** from one consistent, fluent, code-first API. It's pure managed C#, MIT licensed, and there are no watermarks, no page limits, and no paid tiers hiding behind a "contact sales" button.

This is the sibling project to [TerraPDF](https://terrapdf.com/), and everything I learned building that went straight into TerraFluent. Let me show you around.

## The idea: describe the document, not the plumbing

TerraFluent ships as three focused NuGet packages, each tuned to its output format but sharing the same design philosophy:

- **`TerraFluent.Pdf.Reporting`** — a pure managed C# PDF engine (PDF 1.7)
- **`TerraFluent.Html.Reporting`** — paginated, print-ready, self-contained HTML
- **`TerraFluent.Docx.Reporting`** — native Open XML Word documents

You install only what you need:

```bash
dotnet add package TerraFluent.Pdf.Reporting
dotnet add package TerraFluent.Html.Reporting
dotnet add package TerraFluent.Docx.Reporting
```

The core idea across all three is the same: you **declare** what the document should contain — pages, headers, columns, tables, charts — and TerraFluent handles measurement, layout, and pagination for you. No manual cursor tracking. No `y += 20`. No guessing where the page break lands.

## Your first PDF

Here's a complete, runnable PDF report. Notice how it reads top-to-bottom like the document it produces:

```csharp
using TerraFluent.Pdf.Reporting.Core;
using TerraFluent.Pdf.Reporting.Helpers;

PdfDocument.Create(container =>
{
    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        page.DefaultTextStyle(s => s.FontSize(11));

        page.Header()
            .Text("My Report").Bold().FontSize(24)
            .FontColor(Color.Blue.Darken2);

        page.Content().Column(col =>
        {
            col.Spacing(8);
            col.Item().Text("Hello, TerraFluent.Pdf.Reporting!");
            col.Item()
               .Margin(6).Background(Color.Grey.Lighten4).Padding(10)
               .Text("Indented callout box").Bold();
        });

        page.Footer().AlignCenter().Text(t =>
        {
            t.Span("Page ");
            t.CurrentPageNumber().FontSize(9);
            t.Span(" / ");
            t.TotalPages().FontSize(9);
        });
    });
})
.PublishPdf("output.pdf");
```

That's the whole program. `PublishPdf` writes the file; the header, footer, page numbering, and spacing are all declarative. If the content grows past one page, TerraFluent paginates it and repeats the header and footer automatically.

## Tables that know how to break

Real reports are mostly tables, and real tables overflow pages. TerraFluent tables use a column definition and flow their rows across pages, repeating header rows as they go:

```csharp
container.Table(table =>
{
    table.ColumnsDefinition(cols =>
    {
        cols.RelativeColumn(4);
        cols.RelativeColumn(1);
        cols.ConstantColumn(70);
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background("#1a4a8a").Padding(6)
           .Text("Description").Bold().FontColor(Color.White);
        row.Cell().Background("#1a4a8a").Padding(6).AlignCenter()
           .Text("Qty").Bold().FontColor(Color.White);
        row.Cell().Background("#1a4a8a").Padding(6).AlignRight()
           .Text("Price").Bold().FontColor(Color.White);
    });

    foreach (var item in lineItems)
    {
        table.Row(row =>
        {
            row.Cell().Padding(6).Text(item.Name);
            row.Cell().Padding(6).AlignCenter().Text(item.Qty.ToString());
            row.Cell().Padding(6).AlignRight().Text($"${item.Price:N2}");
        });
    }
});
```

Mix `RelativeColumn` and `ConstantColumn` to get fluid layouts with fixed columns where you need them — exactly the kind of thing you'd otherwise fight a low-level PDF API over.

## Barcodes and QR codes, natively

No plugins, no image pre-rendering, no third-party barcode library. Barcodes and QR codes are drawn as crisp vectors:

```csharp
container.Barcode("SKU-00042-A", width: 260, height: 50,
    hexColor: "#1A3C5E", showCaption: true);

container.QrCode("https://terrafluent.dev/", size: 90,
    level: QrErrorCorrectionLevel.Q);
```

Because they're vector-rendered, they stay razor-sharp at any zoom or print resolution.

## AES-256 encryption in a few lines

Sensitive documents shouldn't require a separate tool to lock down. Encryption is first-class, with separate user/owner passwords and granular permissions:

```csharp
PdfDocument.Create(container =>
{
    container.Encrypt(new EncryptionOptions
    {
        UserPassword  = "open123",
        OwnerPassword = "admin456",
        Permissions   = PdfPermissions.Print | PdfPermissions.CopyText,
    });

    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Content().Text("This PDF is password-protected.").Bold();
    });
})
.PublishPdf("protected.pdf");
```

## When you need to draw

Sometimes a report needs a custom diagram, a signature line, or a bit of branded chrome. There's a vector canvas for that:

```csharp
container.Canvas(120, c =>
{
    c.FillRect(0, 0, 200, 80, Color.Blue.Lighten4);
    c.StrokeRect(0, 0, 200, 80, Color.Blue.Darken2, 1.5);
    c.Line(0, 40, 200, 40, Color.Blue.Medium, 0.5);
});
```

## The same report, as HTML

Here's where the "family" idea pays off. The HTML package shares the same declarative spirit, with an entry point tuned for the web:

```csharp
using TerraFluent.Html.Reporting.Model;

var report = ReportDocument.Create(PageSize.A4, PageOrientation.Portrait)
    .SetMargins(40, 40, 60, 60)
    .Header(h => h.AddText("Monthly Sales Report").AlignCenter().Bold())
    .Footer(f => f.AddPageNumber("Page {page} of {totalPages}"))
    .Content(c =>
    {
        c.AddHeading("Sales Summary", HeadingLevel.H1);
        c.AddParagraph("This report summarizes sales activity for the period.");
        c.AddTable(t =>
        {
            t.AddColumns("Product", "Qty", "Revenue");
            t.AddRow("Widget A", "120", "$2,400");
            t.AddRow("Widget B", "85", "$1,700");
        });
    })
    .Build();

report.RenderHtmlDocument("monthly-sales.html");
```

The output is **self-contained HTML and CSS** — nothing else to deploy. It opens in any browser and prints straight to PDF, so it's perfect for emailed reports, in-app previews, or an "Export" button that just works.

A few HTML niceties worth calling out:

**Merged cells** with `ColSpan` / `RowSpan`:

```csharp
table.AddColumns("Category", "Item", "Qty", "Total");

table.AddRow(new TableCell[]
{
    new TableCell("Electronics") { RowSpan = 3 },
    "Wireless Mouse", "2", "$39.98",
});
table.AddRow(new TableCell[] { "Mechanical Keyboard", "1", "$89.00" });
table.AddRow(new TableCell[] { "USB-C Dock", "1", "$64.50" });
```

**Multiple render targets** — a string when you want to inline it, a file when you want to save it, and an async variant for large reports:

```csharp
string html = report.RenderHtml();                 // in-memory string
report.RenderHtmlDocument("report.html");           // save to file

await report.RenderHtmlDocumentAsync(
    Path.Combine(outputDir, "report.html"),
    cancellationToken: cancellationToken);           // async + cancellation
```

**Layout warnings** — if content can't fit cleanly, you get structured warnings instead of a silently broken page:

```csharp
using TerraFluent.Html.Reporting.Layout;

var layout = LayoutEngine.Paginate(report);

foreach (var warning in layout.Warnings)
{
    logger.LogWarning("{ReportWarning}", warning);
}
```

## The same report, as a real Word document

The DOCX package generates **native Open XML** — no Office install, no COM interop, no `Microsoft.Office.Interop` nightmares on a server. And crucially, the output is genuinely editable: real Word tables, real styles, and **real, editable Word charts**.

```csharp
Document.Create(doc =>
{
    doc.MetadataTitle("Quarterly Report")
       .MetadataAuthor("Northwind Consulting");

    doc.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(Unit.Centimetre(2));
        page.Header().Text("Quarterly Report", t => t.Bold().AlignCenter());
        page.Footer().Text(t =>
        {
            t.Span("Page ");
            t.CurrentPageNumber();
            t.Span(" of ");
            t.TotalPages();
            t.AlignCenter();
        });

        page.Content().H1("Executive Summary");
        page.Content().Text("Revenue improved across every practice.");
    });
}).PublishDocx("quarterly-report.docx");
```

Want a chart your users can actually double-click and edit in Word? That's a first-class element:

```csharp
page.Content().Chart(chart => chart
    .Title("Stacked Revenue by Quarter")
    .Width(430).Height(250)
    .AlignCenter()
    .Legend(ChartLegendPosition.Bottom)
    .CategoryAxisTitle("Quarter")
    .ValueAxisTitle("Revenue ($M)")
    .DataLabels()
    .Stacked()
    .Series("Product",  s => s.Bar("Q1", 4.1).Bar("Q2", 4.3).Color(Colors.Blue.L700))
    .Series("Services", s => s.Bar("Q1", 2.2).Bar("Q2", 2.6).Color(Colors.Orange.L700)));
```

And because so many Word workflows are really "fill in the blanks," there's template filling via placeholders and content controls:

```csharp
DocxTemplate.Open("template.docx")
    .Replace("CustomerName", "Ada Lovelace")
    .ReplaceContentControl("InvoiceTotal", "$1,250.00")
    .SaveAs("output.docx");
```

You even get document protection ("Restrict Editing"), auto-numbered figure/table captions, floating images with text wrapping, and Code 128 barcodes rendered as vector shapes.

## One matrix, wide reach

TerraFluent runs where you run. Here's the framework support at a glance:

| Package | Targets | Runs on |
| --- | --- | --- |
| `TerraFluent.Pdf.Reporting` | .NET 8, 9, 10 | Windows, Linux, macOS, containers, serverless |
| `TerraFluent.Html.Reporting` | netstandard2.0, net10.0 | .NET Framework 4.6.1+, .NET Core 2.0+, modern .NET |
| `TerraFluent.Docx.Reporting` | netstandard2.0, net10.0 | .NET Framework 4.6.1+, .NET Core 2.0+, modern .NET |

That `netstandard2.0` target for HTML and DOCX matters: it means these libraries drop into a legacy .NET Framework 4.6.1 app just as happily as a brand-new .NET 10 minimal API or an AWS Lambda.

## Why "zero dependency" is the whole point

Every feature above — layout, tables, barcodes, QR codes, charts, encryption, Open XML packaging — is **pure managed code**. No native binaries. No headless browser to install. No system libraries to `apt-get` into your container image. No P/Invoke that works on your laptop and mysteriously segfaults in production.

That has real consequences:

- **Containers stay tiny and reproducible.** Nothing to install beyond the NuGet package.
- **Serverless just works.** Cold starts don't have to warm up a native rendering engine.
- **Security review is trivial.** There's no third-party runtime surface to audit.
- **Async and streaming are built in**, so large reports don't pin a thread or blow up memory.

When you build a document library on top of a browser or a native toolkit, all of that becomes your operations team's problem. TerraFluent refuses to make it one.

## From TerraPDF to TerraFluent

If you've used [TerraPDF](https://terrapdf.com/), TerraFluent will feel familiar — it's the same values (fluent, dependable, dependency-free) taken to their logical conclusion: **one way of thinking about documents, three formats out the other end.** TerraPDF remains a fantastic, focused choice when PDF is all you need. TerraFluent is for when a single codebase has to speak PDF, HTML, *and* Word without three different libraries and three different headaches.

## Try it

TerraFluent is MIT licensed and free for personal, commercial, and open-source use — no page limits, no watermarks, no tiers.

- 🌐 **Website & docs:** [terrafluent.dev](https://terrafluent.dev/)
- 📄 **PDF reporting:** [terrafluent.dev/pdf](https://terrafluent.dev/pdf) · [`TerraFluent.Pdf.Reporting`](https://www.nuget.org/packages/TerraFluent.Pdf.Reporting)
- 🌍 **HTML reporting:** [terrafluent.dev/html](https://terrafluent.dev/html) · [`TerraFluent.Html.Reporting`](https://www.nuget.org/packages/TerraFluent.Html.Reporting)
- 📝 **DOCX reporting:** [terrafluent.dev/docx](https://terrafluent.dev/docx) · [`TerraFluent.Docx.Reporting`](https://www.nuget.org/packages/TerraFluent.Docx.Reporting)

Install a package, generate your first report, and let me know what you build. If you hit a rough edge or have a feature in mind, I'd genuinely love to hear it — this project gets better with real-world reports throwing real-world edge cases at it.

Happy reporting. 🚀
