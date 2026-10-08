import { nameToEmoji } from 'gemoji';

const EMOJI_SHORTCODE_PATTERN = /:(\+1|[-\w]+):/g;

function emojifyShortcodes(value: string) {
  return value.replace(
    EMOJI_SHORTCODE_PATTERN,
    (shortcode, name: string) => nameToEmoji[name] ?? shortcode
  );
}

export { emojifyShortcodes };
