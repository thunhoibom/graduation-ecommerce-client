const messengerPageId = process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID?.trim();

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.914 1.454 5.514 3.726 7.211V22l3.31-1.814c.884.246 1.818.38 2.964.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm1.189 12.44-2.547-2.717-4.967 2.717 5.464-5.803 2.615 2.716 4.9-2.716-5.465 5.803z" />
  </svg>
);

export default function MessengerChatButton() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!messengerPageId && isProduction) {
    return null;
  }

  const messengerUrl = messengerPageId
    ? `https://m.me/${encodeURIComponent(messengerPageId)}`
    : "https://m.me";

  return (
    <a
      href={messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat qua Facebook Messenger"
      title={!messengerPageId ? "Thiếu NEXT_PUBLIC_MESSENGER_PAGE_ID" : "Chat qua Facebook Messenger"}
      className="fixed bottom-24 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0084FF] shadow-lg transition hover:scale-105 hover:bg-[#0078E7]"
    >
      <MessengerIcon />
    </a>
  );
}
