import { shareIdea } from '../game/share-idea';
import type { Ingredient } from '../game/bulbee-line';
import { drawShareImage } from './share-image';

export function bindSocialShare(
  capture: () => HTMLCanvasElement,
  ingredients: () => Ingredient[],
  ready: () => boolean,
) {
  const button = document.querySelector<HTMLButtonElement>('#share-idea')!;
  const dialog = document.querySelector<HTMLDialogElement>('#share-dialog')!;
  const preview = document.querySelector<HTMLImageElement>('#share-preview')!;
  const status = document.querySelector<HTMLElement>('#share-status')!;
  const caption =
    document.querySelector<HTMLTextAreaElement>('#share-caption')!;
  const twitter = document.querySelector<HTMLAnchorElement>('#share-twitter')!;
  const native = document.querySelector<HTMLButtonElement>('#share-native')!;
  const instagram =
    document.querySelector<HTMLButtonElement>('#share-instagram')!;
  const download =
    document.querySelector<HTMLAnchorElement>('#share-download')!;
  const copy = document.querySelector<HTMLButtonElement>('#share-copy')!;
  const close = document.querySelector<HTMLButtonElement>('#share-close')!;
  let file: File | undefined;
  let imageUrl: string | undefined;
  let revision = 0;
  const canShare = () =>
    !!file && !!navigator.share && !!navigator.canShare?.({ files: [file] });
  function release() {
    revision++;
    file = undefined;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = undefined;
    preview.removeAttribute('src');
    download.removeAttribute('href');
  }
  function open() {
    release();
    const attempt = revision;
    native.disabled = instagram.disabled = true;
    download.hidden = true;
    preview.hidden = true;
    const current = ingredients();
    const visible = document.querySelector<HTMLElement>(
      '#bulbee-speech:not([hidden]), #coinie-speech:not([hidden])',
    );
    const content = shareIdea(current, visible?.textContent ?? undefined);
    caption.value = content.caption;
    twitter.href = content.twitterUrl;
    status.textContent = 'Making your screenshot…';
    dialog.showModal();
    try {
      drawShareImage(capture(), content.bubble, content.idea).toBlob((blob) => {
        if (!blob || attempt !== revision) return;
        file = new File([blob], 'idea-grabber-my-stupid-idea.png', {
          type: 'image/png',
        });
        imageUrl = URL.createObjectURL(blob);
        preview.src = imageUrl;
        preview.hidden = false;
        download.href = imageUrl;
        download.hidden = false;
        native.disabled = !canShare();
        instagram.disabled = false;
        status.textContent = canShare()
          ? 'Share the image to an installed app, or save it and attach it to your post.'
          : 'Save the image and attach it to your post. X/Twitter opens a draft with your idea and game link.';
      }, 'image/png');
    } catch {
      status.textContent =
        'The screenshot could not be made. You can still copy your idea or open an X/Twitter draft.';
    }
  }
  async function share() {
    if (!file || !canShare()) return;
    try {
      await navigator.share({
        files: [file],
        title: 'My stupid game idea',
        text: caption.value,
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        status.textContent =
          'Sharing is unavailable. Save the image and attach it to your post instead.';
    }
  }
  const insta = () => {
    if (canShare()) {
      status.textContent =
        'Choose Instagram from your share menu if it is available.';
      void share();
    } else {
      download.click();
      status.textContent =
        'Image saved. Open Instagram, attach the image, and copy the caption below.';
    }
  };
  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption.value);
      status.textContent = 'Caption copied!';
    } catch {
      caption.focus();
      caption.select();
      status.textContent = 'Select and copy the caption below.';
    }
  };
  const shut = () => dialog.close();
  button.addEventListener('click', open);
  native.addEventListener('click', share);
  instagram.addEventListener('click', insta);
  copy.addEventListener('click', copyCaption);
  close.addEventListener('click', shut);
  dialog.addEventListener('close', release);
  return {
    update() {
      button.disabled = !ready();
      button.title = ready()
        ? 'Share your stupid idea'
        : 'Grab a genre and wait for Coinie to return to share your idea';
    },
    dispose() {
      release();
      dialog.close();
      button.removeEventListener('click', open);
      native.removeEventListener('click', share);
      instagram.removeEventListener('click', insta);
      copy.removeEventListener('click', copyCaption);
      close.removeEventListener('click', shut);
      dialog.removeEventListener('close', release);
    },
  };
}
