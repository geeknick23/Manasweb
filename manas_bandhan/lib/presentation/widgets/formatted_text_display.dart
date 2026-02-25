import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';

class FormattedTextDisplay extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign textAlign;

  const FormattedTextDisplay(
    this.text, {
    super.key,
    this.style,
    this.textAlign = TextAlign.start,
  });

  @override
  Widget build(BuildContext context) {
    final defaultStyle = style ?? AppTextStyles.bodyMedium;
    
    // Pre-process text to handle escaped newlines and HTML tags
    // Pre-process text to handle escaped newlines, HTML tags, and entities
    String processedText = text
        .replaceAll(r'\\n', '\n') // Handle literal escaped newlines
        .replaceAll(r'\\r', '')   // Remove literal carriage returns
        .replaceAll(r'\\t', ' ')  // Replace literal tabs with space
        // Remove style and script blocks WITH their content
        .replaceAll(RegExp(r'<style[^>]*>[\s\S]*?</style>', caseSensitive: false), '')
        .replaceAll(RegExp(r'<script[^>]*>[\s\S]*?</script>', caseSensitive: false), '')
        .replaceAll(RegExp(r'<!--[\s\S]*?-->'), '') // Remove comments
        // Convert list items to bullet points
        .replaceAll(RegExp(r'<li[^>]*>', caseSensitive: false), '\n• ')
        .replaceAll(RegExp(r'</li>', caseSensitive: false), '')
        // Handle block elements with newlines
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</?(p|div|section|h[1-6]|ul|ol)[^>]*>', caseSensitive: false), '\n')
        // Strip all remaining tags
        .replaceAll(RegExp(r'<[^>]*>'), '')
        // Decode common HTML entities
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'")
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        // Clean up excessive newlines
        .replaceAll(RegExp(r'\n\s*\n'), '\n\n')
        .trim();

    // Split text by newlines
    final lines = processedText.split('\n');
    final List<Widget> widgets = [];

    for (var i = 0; i < lines.length; i++) {
      String line = lines[i].trim();
      
      if (line.isEmpty) {
        // Add spacing for empty lines
        if (widgets.isNotEmpty && widgets.last is! SizedBox) {
             widgets.add(const SizedBox(height: 12));
        }
        continue;
      }

      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        // Remove the bullet character and trim
        String content = line.substring(1).trim();
        
        widgets.add(Padding(
          padding: const EdgeInsets.only(bottom: 8.0, left: 8.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('•', style: defaultStyle.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(width: 8),
              Expanded(
                child: _LinkifiedText(
                  text: content,
                  style: defaultStyle.copyWith(height: 1.5),
                  textAlign: textAlign,
                ),
              ),
            ],
          ),
        ));
      } else {
        // Normal paragraph
        widgets.add(Padding(
          padding: const EdgeInsets.only(bottom: 8.0),
          child: _LinkifiedText(
            text: line,
            style: defaultStyle.copyWith(height: 1.5),
            textAlign: textAlign,
          ),
        ));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: widgets,
    );
  }
}

class _LinkifiedText extends StatelessWidget {
  final String text;
  final TextStyle style;
  final TextAlign textAlign;

  const _LinkifiedText({
    required this.text,
    required this.style,
    required this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    if (!text.contains('http')) {
      return Text(text, style: style, textAlign: textAlign);
    }

    final urlRegExp = RegExp(
      r'((https?:www\.)|(https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}(\/[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?',
      caseSensitive: false,
    );

    final Iterable<RegExpMatch> matches = urlRegExp.allMatches(text);
    if (matches.isEmpty) {
      return Text(text, style: style, textAlign: textAlign);
    }

    int currentPosition = 0;
    final List<TextSpan> spans = [];

    for (final RegExpMatch match in matches) {
      if (match.start > currentPosition) {
        spans.add(TextSpan(text: text.substring(currentPosition, match.start), style: style));
      }

      final String matchedText = match.group(0)!;
      String url = matchedText;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://$url';
      }

      spans.add(
        TextSpan(
          text: matchedText,
          style: style.copyWith(
                color: AppColors.info,
                decoration: TextDecoration.underline,
              ),
          recognizer: TapGestureRecognizer()
            ..onTap = () async {
              final uri = Uri.parse(url);
              try {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Could not open link')),
                  );
                }
              }
            },
        ),
      );

      currentPosition = match.end;
    }

    if (currentPosition < text.length) {
      spans.add(TextSpan(text: text.substring(currentPosition), style: style));
    }

    return RichText(
      textAlign: textAlign,
      text: TextSpan(children: spans),
    );
  }
}
