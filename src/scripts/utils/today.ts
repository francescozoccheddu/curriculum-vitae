export function setupToday(): void {
  const elements = Array.from(document.getElementsByClassName('today')) as HTMLElement[] as readonly HTMLElement[];
  const text = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  for (const element of elements) {
    element.textContent = text;
  }
}