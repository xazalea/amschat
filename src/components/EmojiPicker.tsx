import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

// Standard emoji categories
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦠', '🧫'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '✨', '⭐', '🌟', '💫', '✴️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '™️', '©️', '®️'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
  'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊'],
  'Nature': ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🐚', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊'],
  'Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '🉑', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄'],
};

// Emoji Kitchen combinations - using correct Google API format
// The format is: https://www.gstatic.com/android/keyboard/emojikitchen/{date}/emoji_u{code1}_emoji_u{code2}.png
// But we need to try both orders since combinations can be in either direction
const EMOJI_KITCHEN_BASE = 'https://www.gstatic.com/android/keyboard/emojikitchen';

// Convert emoji to Unicode codepoint string (lowercase)
function emojiToCodepoint(emoji: string): string {
  const codepoints: string[] = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      codepoints.push(cp.toString(16).toLowerCase());
    }
  }
  return codepoints.join('_');
}

// Known working emoji kitchen combinations with their dates
// Format: "cp1_cp2" -> date
const KNOWN_COMBINATIONS: Record<string, string> = {
  // 😀 combinations
  '1f600_1f602': '20210218',
  '1f600_1f60d': '20210218',
  '1f600_2764': '20210218',
  '1f600_1f4af': '20210218',
  '1f600_2728': '20210218',
  '1f600_1f525': '20210218',
  
  // 😂 combinations
  '1f602_1f602': '20210218',
  '1f602_2764': '20210218',
  '1f602_1f62d': '20210218',
  '1f602_1f97a': '20210218',
  
  // 😍 combinations
  '1f60d_2764': '20210218',
  '1f60d_1f602': '20210218',
  '1f60d_1f970': '20210218',
  
  // 🥰 combinations
  '1f970_2764': '20210218',
  '1f970_1f60d': '20210218',
  
  // 🥺 combinations
  '1f97a_2764': '20210218',
  '1f97a_1f602': '20210218',
  '1f97a_1f62d': '20210218',
  
  // 😭 combinations
  '1f62d_1f602': '20210218',
  '1f62d_2764': '20210218',
  
  // ❤️ combinations (most popular)
  '2764_1f60d': '20210218',
  '2764_1f525': '20210218',
  '2764_2728': '20210218',
  '2764_1f4af': '20210218',
  '2764_1f389': '20210218',
  '2764_1f602': '20210218',
  '2764_1f97a': '20210218',
  '2764_1f970': '20210218',
  
  // 🔥 combinations
  '1f525_2764': '20210218',
  '1f525_1f44d': '20210218',
  '1f525_1f4af': '20210218',
  '1f525_1f60d': '20210218',
  
  // ✨ combinations
  '2728_2764': '20210218',
  '2728_1f4af': '20210218',
  '2728_1f31f': '20210218',
  
  // 💯 combinations
  '1f4af_2764': '20210218',
  '1f4af_1f525': '20210218',
  
  // 👍 combinations
  '1f44d_1f525': '20210218',
  '1f44d_2764': '20210218',
  
  // 👻 combinations
  '1f47b_2764': '20210218',
  '1f47b_1f602': '20210218',
  
  // 💀 combinations
  '1f480_1f602': '20210218',
  '1f480_2764': '20210218',
  
  // 🎉 combinations
  '1f389_2764': '20210218',
  '1f389_1f60d': '20210218',
  
  // 🌈 combinations
  '1f308_2764': '20210218',
  '1f308_1f60d': '20210218',
  
  // ⭐ combinations
  '2b50_2764': '20210218',
  
  // 🌟 combinations
  '1f31f_2764': '20210218',
  '1f31f_2728': '20210218',
};

// Get Emoji Kitchen URL for a combination
function getEmojiKitchenUrl(emoji1: string, emoji2: string): string | null {
  const cp1 = emojiToCodepoint(emoji1);
  const cp2 = emojiToCodepoint(emoji2);
  
  // Try both orders
  const key1 = `${cp1}_${cp2}`;
  const key2 = `${cp2}_${cp1}`;
  
  let date: string;
  let baseCp: string;
  let comboCp: string;
  
  if (KNOWN_COMBINATIONS[key1]) {
    date = KNOWN_COMBINATIONS[key1];
    baseCp = cp1;
    comboCp = cp2;
  } else if (KNOWN_COMBINATIONS[key2]) {
    date = KNOWN_COMBINATIONS[key2];
    baseCp = cp2;
    comboCp = cp1;
  } else {
    // Not a known combination - return null to show "No combo"
    return null;
  }
  
  // Build URL
  return `${EMOJI_KITCHEN_BASE}/${date}/emoji_u${baseCp}_emoji_u${comboCp}.png`;
}

// Check if emoji has known combinations
function hasCombinations(emoji: string): boolean {
  const cp = emojiToCodepoint(emoji);
  // Check if this emoji appears in any known combination
  for (const key of Object.keys(KNOWN_COMBINATIONS)) {
    if (key.startsWith(cp + '_') || key.endsWith('_' + cp)) {
      return true;
    }
  }
  return false;
}

export function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
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

  // Handle emoji click
  const handleEmojiClick = useCallback((emoji: string) => {
    setSelectedEmojis(prev => {
      const newSelection = [...prev];
      
      if (newSelection.length === 0) {
        // First emoji selected
        newSelection.push(emoji);
      } else if (newSelection.length === 1) {
        if (newSelection[0] === emoji) {
          // Deselect if same emoji clicked
          return [];
        }
        // Second emoji selected - try to combine
        newSelection.push(emoji);
        const url = getEmojiKitchenUrl(newSelection[0], newSelection[1]);
        if (url) {
          setPreviewUrl(url);
          setPreviewError(false);
        }
      } else {
        // Already have 2 selected, start fresh with this one
        setPreviewUrl(null);
        setPreviewError(false);
        return [emoji];
      }
      
      return newSelection;
    });
  }, []);

  // Send single emoji
  const handleSendSingle = useCallback((emoji: string) => {
    onSelect(emoji);
    onClose();
    setSelectedEmojis([]);
    setSearch('');
    setPreviewUrl(null);
    setPreviewError(false);
  }, [onSelect, onClose]);

  // Send combination
  const handleSendCombination = useCallback(() => {
    if (selectedEmojis.length === 2 && previewUrl && !previewError) {
      onSelect(`[EMOJI_KITCHEN:${selectedEmojis[0]}:${selectedEmojis[1]}:${previewUrl}]`);
      onClose();
      setSelectedEmojis([]);
      setSearch('');
      setPreviewUrl(null);
      setPreviewError(false);
    }
  }, [selectedEmojis, previewUrl, previewError, onSelect, onClose]);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedEmojis([]);
    setPreviewUrl(null);
    setPreviewError(false);
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedEmojis([]);
      setSearch('');
      setPreviewUrl(null);
      setPreviewError(false);
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
            Emoji
            {selectedEmojis.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                (select 2 to combine)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          {/* Selection preview */}
          {selectedEmojis.length > 0 && (
            <div className="mb-3 p-2 bg-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedEmojis.map((emoji, idx) => (
                    <span key={idx} className="text-2xl">{emoji}</span>
                  ))}
                  {selectedEmojis.length === 2 && (
                    <>
                      <span className="text-muted-foreground">=</span>
                      {previewUrl && !previewError ? (
                        <img 
                          src={previewUrl} 
                          alt="Combined" 
                          className="w-8 h-8"
                          onError={() => setPreviewError(true)}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">No combo</span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {selectedEmojis.length === 1 && (
                    <button
                      onClick={() => handleSendSingle(selectedEmojis[0])}
                      className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                    >
                      Send
                    </button>
                  )}
                  {selectedEmojis.length === 2 && previewUrl && !previewError && (
                    <button
                      onClick={handleSendCombination}
                      className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                    >
                      Send
                    </button>
                  )}
                  <button
                    onClick={handleClear}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {selectedEmojis.length === 1 && hasCombinations(selectedEmojis[0]) && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Click another emoji to combine
                </p>
              )}
            </div>
          )}

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

          {/* Emoji grid */}
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {Object.entries(filteredCategories).map(([category, emojis]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5 px-1">{category}</h4>
                  <div className="grid grid-cols-8 gap-0.5">
                    {emojis.map((emoji, idx) => {
                      const isSelected = selectedEmojis.includes(emoji);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleEmojiClick(emoji)}
                          className={`w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded transition-colors ${
                            isSelected ? 'bg-primary/20 ring-1 ring-primary' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}