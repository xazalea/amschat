import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

// Standard emoji categories
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦠', '🧫'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '❇️', '✨', '⭐', '🌟', '💫', '✴️', '❇️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
  'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
  'Nature': ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🐚', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊'],
  'Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '🉑', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'],
};

// Emoji Kitchen supported combinations (popular ones)
// Format: emoji1-emoji2 -> URL pattern
const EMOJI_KITCHEN_BASE = 'https://www.gstatic.com/android/keyboard/emojikitchen';

// Get supported emoji kitchen pairs
const getEmojiKitchenUrl = (emoji1: string, emoji2: string): string | null => {
  // Convert emoji to unicode codepoints
  const toCodepoint = (emoji: string) => {
    const codepoints = [];
    for (const c of emoji) {
      codepoints.push(c.codePointAt(0)?.toString(16).toLowerCase() || '');
    }
    return codepoints.join('-');
  };
  
  const cp1 = toCodepoint(emoji1);
  const cp2 = toCodepoint(emoji2);
  
  // Emoji Kitchen uses date-based URLs, we'll use a known working format
  // These are some popular combinations that work
  const knownCombinations: Record<string, string> = {
    '😀-😀': '20201001/emoji_u1f600/emoji_u1f600.png',
    '😀-😍': '20201001/emoji_u1f600/emoji_u1f60d.png',
    '😍-😀': '20201001/emoji_u1f60d/emoji_u1f600.png',
    '🥺-😭': '20201001/emoji_u1f97a/emoji_u1f62d.png',
    '😭-🥺': '20201001/emoji_u1f62d/emoji_u1f97a.png',
    '😊-❤️': '20201001/emoji_u1f60a/emoji_u2764.png',
    '❤️-😊': '20201001/emoji_u2764/emoji_u1f60a.png',
    '😎-🔥': '20201001/emoji_u1f60e/emoji_u1f525.png',
    '🔥-😎': '20201001/emoji_u1f525/emoji_u1f60e.png',
    '🥰-💕': '20201001/emoji_u1f970/emoji_u1f495.png',
    '💕-🥰': '20201001/emoji_u1f495/emoji_u1f970.png',
    '😴-💤': '20201001/emoji_u1f634/emoji_u1f4a4.png',
    '💤-😴': '20201001/emoji_u1f4a4/emoji_u1f634.png',
    '🤔-💡': '20201001/emoji_u1f914/emoji_u1f4a1.png',
    '💡-🤔': '20201001/emoji_u1f4a1/emoji_u1f914.png',
    '😱-👻': '20201001/emoji_u1f631/emoji_u1f47b.png',
    '👻-😱': '20201001/emoji_u1f47b/emoji_u1f631.png',
    '🥳-🎉': '20201001/emoji_u1f973/emoji_u1f389.png',
    '🎉-🥳': '20201001/emoji_u1f389/emoji_u1f973.png',
    '🤩-⭐': '20201001/emoji_u1f929/emoji_u2b50.png',
    '⭐-🤩': '20201001/emoji_u2b50/emoji_u1f929.png',
    '😭-😭': '20201001/emoji_u1f62d/emoji_u1f62d.png',
    '😂-😂': '20201001/emoji_u1f602/emoji_u1f602.png',
    '🥺-🥺': '20201001/emoji_u1f97a/emoji_u1f97a.png',
    '😍-😍': '20201001/emoji_u1f60d/emoji_u1f60d.png',
    '🥰-🥰': '20201001/emoji_u1f970/emoji_u1f970.png',
    '😎-😎': '20201001/emoji_u1f60e/emoji_u1f60e.png',
    '🤠-🤠': '20201001/emoji_u1f920/emoji_u1f920.png',
    '🤡-🤡': '20201001/emoji_u1f921/emoji_u1f921.png',
    '👻-👻': '20201001/emoji_u1f47b/emoji_u1f47b.png',
    '🎃-🎃': '20201001/emoji_u1f383/emoji_u1f383.png',
    '💀-💀': '20201001/emoji_u1f480/emoji_u1f480.png',
    '👽-👽': '20201001/emoji_u1f47d/emoji_u1f47d.png',
    '🤖-🤖': '20201001/emoji_u1f916/emoji_u1f916.png',
    '🐱-❤️': '20201001/emoji_u1f431/emoji_u2764.png',
    '❤️-🐱': '20201001/emoji_u2764/emoji_u1f431.png',
    '🐶-❤️': '20201001/emoji_u1f436/emoji_u2764.png',
    '❤️-🐶': '20201001/emoji_u2764/emoji_u1f436.png',
    '🦄-✨': '20201001/emoji_u1f984/emoji_u2728.png',
    '✨-🦄': '20201001/emoji_u2728/emoji_u1f984.png',
    '🌈-⭐': '20201001/emoji_u1f308/emoji_u2b50.png',
    '⭐-🌈': '20201001/emoji_u2b50/emoji_u1f308.png',
    '🔥-🔥': '20201001/emoji_u1f525/emoji_u1f525.png',
    '💯-💯': '20201001/emoji_u1f4af/emoji_u1f4af.png',
    '❤️-❤️': '20201001/emoji_u2764/emoji_u2764.png',
    '💙-💙': '20201001/emoji_u1f499/emoji_u1f499.png',
    '💚-💚': '20201001/emoji_u1f49a/emoji_u1f49a.png',
    '💛-💛': '20201001/emoji_u1f49b/emoji_u1f49b.png',
    '💜-💜': '20201001/emoji_u1f49c/emoji_u1f49c.png',
    '🖤-🖤': '20201001/emoji_u1f5a4/emoji_u1f5a4.png',
    '🧡-🧡': '20201001/emoji_u1f9e1/emoji_u1f9e1.png',
    '🤍-🤍': '20201001/emoji_u1f90d/emoji_u1f90d.png',
    '🤎-🤎': '20201001/emoji_u1f90e/emoji_u1f90e.png',
  };
  
  const key = `${emoji1}-${emoji2}`;
  const path = knownCombinations[key];
  
  if (path) {
    return `${EMOJI_KITCHEN_BASE}/${path}`;
  }
  
  // Try to generate a URL for any combination
  // Note: This may not work for all combinations
  return `${EMOJI_KITCHEN_BASE}/20201001/emoji_u${cp1}/emoji_u${cp2}.png`;
};

// Popular base emojis for combinations
const COMBINATION_BASES = ['😀', '😍', '🥺', '😭', '😊', '😎', '🥰', '🤔', '😱', '🥳', '🤩', '😂', '🤠', '🤡', '👻', '💀', '👽', '🤖', '🐱', '🐶', '🦄', '🌈', '🔥', '💯', '❤️', '💙', '💚', '💛', '💜', '🖤'];

export function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('emojis');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter emojis by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES;
    
    const searchLower = search.toLowerCase();
    const filtered: Record<string, string[]> = {};
    
    Object.entries(EMOJI_CATEGORIES).forEach(([category, emojis]) => {
      // For now, just filter by emoji presence (could add names/keywords)
      const matching = emojis.filter(emoji => 
        emoji.includes(search) || 
        // Search by common names
        (searchLower === 'heart' && ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝'].includes(emoji)) ||
        (searchLower === 'face' && ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬'].includes(emoji))
      );
      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });
    
    return filtered;
  }, [search]);

  const handleSelect = useCallback((emoji: string) => {
    onSelect(emoji);
    onClose();
    setSelectedEmoji(null);
    setSearch('');
  }, [onSelect, onClose]);

  const handleCreateCombination = useCallback((emoji1: string, emoji2: string) => {
    const url = getEmojiKitchenUrl(emoji1, emoji2);
    if (url) {
      // Send as a custom emoji combination
      onSelect(`[EMOJI_COMBINATION:${emoji1}:${emoji2}]`);
      onClose();
      setSelectedEmoji(null);
    }
  }, [onSelect, onClose]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedEmoji(null);
      setSearch('');
      setActiveTab('emojis');
    }
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4" />
            Emoji Picker
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
              className="pl-9"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-3">
              <TabsTrigger value="emojis" className="flex-1">Emojis</TabsTrigger>
              <TabsTrigger value="kitchen" className="flex-1">Kitchen ✨</TabsTrigger>
            </TabsList>

            <TabsContent value="emojis" className="mt-0">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {Object.entries(filteredCategories).map(([category, emojis]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5 px-1">{category}</h4>
                      <div className="grid grid-cols-8 gap-0.5">
                        {emojis.map((emoji, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelect(emoji)}
                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(filteredCategories).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No emojis found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="kitchen" className="mt-0">
              <ScrollArea className="h-64">
                {selectedEmoji ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Combine {selectedEmoji} with:
                      </span>
                      <button
                        onClick={() => setSelectedEmoji(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-0.5">
                      {COMBINATION_BASES.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCreateCombination(selectedEmoji, emoji)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Click an emoji to create a combination!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      Select an emoji to combine with others!
                    </p>
                    <div className="grid grid-cols-8 gap-0.5">
                      {COMBINATION_BASES.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedEmoji(emoji)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5 px-1">All Emojis</h4>
                      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <div key={category} className="mb-2">
                          <div className="grid grid-cols-8 gap-0.5">
                            {emojis.slice(0, 16).map((emoji, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedEmoji(emoji)}
                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}