import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, Sparkles, X, Sticker, Smile } from 'lucide-react';
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
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦠', '🧫'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '✨', '⭐', '🌟', '💫', '✴️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '™️', '©️', '®️'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
  'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊'],
  'Nature': ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🐚', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊'],
  'Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '🉑', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄'],
};

// Sticker packs (Twemoji-based)
const STICKER_PACKS = [
  {
    name: 'Faces',
    stickers: [
      { emoji: '😀', name: 'Grinning' },
      { emoji: '😂', name: 'Joy' },
      { emoji: '🥰', name: 'Love' },
      { emoji: '😎', name: 'Cool' },
      { emoji: '🤔', name: 'Thinking' },
      { emoji: '😭', name: 'Crying' },
      { emoji: '🥺', name: 'Pleading' },
      { emoji: '😤', name: 'Angry' },
      { emoji: '🤡', name: 'Clown' },
      { emoji: '💀', name: 'Skull' },
      { emoji: '👻', name: 'Ghost' },
      { emoji: '👽', name: 'Alien' },
    ],
  },
  {
    name: 'Hearts',
    stickers: [
      { emoji: '❤️', name: 'Red Heart' },
      { emoji: '🧡', name: 'Orange Heart' },
      { emoji: '💛', name: 'Yellow Heart' },
      { emoji: '💚', name: 'Green Heart' },
      { emoji: '💙', name: 'Blue Heart' },
      { emoji: '💜', name: 'Purple Heart' },
      { emoji: '🖤', name: 'Black Heart' },
      { emoji: '🤍', name: 'White Heart' },
      { emoji: '💔', name: 'Broken Heart' },
      { emoji: '💕', name: 'Two Hearts' },
      { emoji: '💖', name: 'Sparkle Heart' },
      { emoji: '💗', name: 'Growing Heart' },
    ],
  },
  {
    name: 'Animals',
    stickers: [
      { emoji: '🐱', name: 'Cat' },
      { emoji: '🐶', name: 'Dog' },
      { emoji: '🦊', name: 'Fox' },
      { emoji: '🐻', name: 'Bear' },
      { emoji: '🐼', name: 'Panda' },
      { emoji: '🦄', name: 'Unicorn' },
      { emoji: '🐸', name: 'Frog' },
      { emoji: '🦋', name: 'Butterfly' },
      { emoji: '🦈', name: 'Shark' },
      { emoji: '🐙', name: 'Octopus' },
      { emoji: '🦀', name: 'Crab' },
      { emoji: '🐳', name: 'Whale' },
    ],
  },
];

// Emoji Kitchen API helper
// Based on https://github.com/xsalazar/emoji-kitchen
const EMOJI_KITCHEN_BASE = 'https://www.gstatic.com/android/keyboard/emojikitchen';

// Convert emoji to Unicode codepoint string
function emojiToCodepoint(emoji: string): string {
  const codepoints: string[] = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      codepoints.push(cp.toString(16).toLowerCase());
    }
  }
  return codepoints.join('-');
}

// Known working date prefixes for emoji kitchen
const KNOWN_DATES: Record<string, string> = {
  // Smileys
  '1f600': '20201001', // 😀
  '1f602': '20201001', // 😂
  '1f60d': '20201001', // 😍
  '1f60e': '20201001', // 😎
  '1f60a': '20201001', // 😊
  '1f970': '20201001', // 🥰
  '1f97a': '20201001', // 🥺
  '1f62d': '20201001', // 😭
  '1f914': '20201001', // 🤔
  '1f920': '20201001', // 🤠
  '1f921': '20201001', // 🤡
  '1f929': '20201001', // 🤩
  '1f973': '20201001', // 🥳
  '1f631': '20201001', // 😱
  '1f634': '20201001', // 😴
  // Hearts
  '2764': '20201001', // ❤️
  '1f499': '20201001', // 💙
  '1f49a': '20201001', // 💚
  '1f49b': '20201001', // 💛
  '1f49c': '20201001', // 💜
  '1f5a4': '20201001', // 🖤
  '1f9e1': '20201001', // 🧡
  '1f90d': '20201001', // 🤍
  '1f90e': '20201001', // 🤎
  '1f495': '20201001', // 💕
  // Others
  '1f47b': '20201001', // 👻
  '1f480': '20201001', // 💀
  '1f47d': '20201001', // 👽
  '1f916': '20201001', // 🤖
  '1f431': '20201001', // 🐱
  '1f436': '20201001', // 🐶
  '1f984': '20201001', // 🦄
  '1f525': '20201001', // 🔥
  '2728': '20201001', // ✨
  '2b50': '20201001', // ⭐
  '1f389': '20201001', // 🎉
  '1f4a1': '20201001', // 💡
  '1f4a4': '20201001', // 💤
  '1f4af': '20201001', // 💯
  '1f308': '20201001', // 🌈
  '1f383': '20201001', // 🎃
};

// Get Emoji Kitchen URL for a combination
function getEmojiKitchenUrl(emoji1: string, emoji2: string): string | null {
  const cp1 = emojiToCodepoint(emoji1);
  const cp2 = emojiToCodepoint(emoji2);
  
  // Get the date for the first emoji (use as base)
  const date = KNOWN_DATES[cp1] || KNOWN_DATES[cp2] || '20201001';
  
  // Build URL - format: {base}/{date}/emoji_u{cp1}/emoji_u{cp2}.png
  return `${EMOJI_KITCHEN_BASE}/${date}/emoji_u${cp1}/emoji_u${cp2}.png`;
}

// Popular emojis for combinations
const COMBINATION_BASES = [
  '😀', '😂', '😍', '🥰', '😎', '🥺', '😭', '🤔', '😱', '🥳', '🤩', '🤠',
  '🤡', '👻', '💀', '👽', '🤖', '❤️', '💙', '💚', '💛', '💜', '🖤', '🔥',
  '✨', '⭐', '🎉', '🐱', '🐶', '🦄', '🌈', '💯',
];

export function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('emojis');
  const [previewCombination, setPreviewCombination] = useState<{ url: string; emoji1: string; emoji2: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter emojis by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES;
    
    const searchLower = search.toLowerCase();
    const filtered: Record<string, string[]> = {};
    
    Object.entries(EMOJI_CATEGORIES).forEach(([category, emojis]) => {
      const matching = emojis.filter(emoji => emoji.includes(search));
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
    setPreviewCombination(null);
  }, [onSelect, onClose]);

  const handleCreateCombination = useCallback((emoji1: string, emoji2: string) => {
    const url = getEmojiKitchenUrl(emoji1, emoji2);
    if (url) {
      // Send as a custom emoji combination image
      onSelect(`[EMOJI_KITCHEN:${emoji1}:${emoji2}:${url}]`);
      onClose();
      setSelectedEmoji(null);
      setPreviewCombination(null);
    }
  }, [onSelect, onClose]);

  const handlePreviewCombination = useCallback((emoji1: string, emoji2: string) => {
    const url = getEmojiKitchenUrl(emoji1, emoji2);
    if (url) {
      setPreviewCombination({ url, emoji1, emoji2 });
    }
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedEmoji(null);
      setSearch('');
      setActiveTab('emojis');
      setPreviewCombination(null);
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
            <Smile className="w-4 h-4" />
            Emoji & Stickers
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
              <TabsTrigger value="emojis" className="flex-1 gap-1">
                <Smile className="w-3 h-3" />
                Emojis
              </TabsTrigger>
              <TabsTrigger value="kitchen" className="flex-1 gap-1">
                <Sparkles className="w-3 h-3" />
                Kitchen
              </TabsTrigger>
              <TabsTrigger value="stickers" className="flex-1 gap-1">
                <Sticker className="w-3 h-3" />
                Stickers
              </TabsTrigger>
            </TabsList>

            {/* Standard Emojis Tab */}
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

            {/* Emoji Kitchen Tab */}
            <TabsContent value="kitchen" className="mt-0">
              <ScrollArea className="h-64">
                {selectedEmoji ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Combine {selectedEmoji} with:
                      </span>
                      <button
                        onClick={() => {
                          setSelectedEmoji(null);
                          setPreviewCombination(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Preview */}
                    {previewCombination && (
                      <div className="flex items-center justify-center gap-2 p-2 bg-secondary rounded-lg">
                        <span className="text-2xl">{previewCombination.emoji1}</span>
                        <span className="text-lg text-muted-foreground">+</span>
                        <span className="text-2xl">{previewCombination.emoji2}</span>
                        <span className="text-lg text-muted-foreground">=</span>
                        <img 
                          src={previewCombination.url} 
                          alt="Combined emoji" 
                          className="w-10 h-10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => handleCreateCombination(previewCombination.emoji1, previewCombination.emoji2)}
                          className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Send
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-8 gap-0.5">
                      {COMBINATION_BASES.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePreviewCombination(selectedEmoji, emoji)}
                          onDoubleClick={() => handleCreateCombination(selectedEmoji, emoji)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Click to preview, double-click to send
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

            {/* Stickers Tab */}
            <TabsContent value="stickers" className="mt-0">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {STICKER_PACKS.map((pack) => (
                    <div key={pack.name}>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5 px-1">{pack.name}</h4>
                      <div className="grid grid-cols-6 gap-1">
                        {pack.stickers.map((sticker, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelect(`[STICKER:${sticker.emoji}]`)}
                            className="aspect-square flex flex-col items-center justify-center p-1 hover:bg-secondary rounded transition-colors"
                            title={sticker.name}
                          >
                            <span className="text-2xl">{sticker.emoji}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}