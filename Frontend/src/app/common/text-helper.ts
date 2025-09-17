export function getPlainTextFromHtml(html: string) {
  return html.replaceAll(/<[^>]+>/gm, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&le;', '≤')
    .replaceAll('&ge;', '≥');
}
