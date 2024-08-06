import { JSDOM } from 'jsdom';

export async function getBiblia() {
  try {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const yesterdayString = date
      .toLocaleDateString('ru-RU')
      .replace(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/, '$3-$2-$1');

    const res = await fetch('https://azbyka.ru/biblia/days/' + yesterdayString);
    const str = await res.text();
    const document = new JSDOM(str).window.document;

    let stringBuilder = '#Евангельские_Апостольские_чтения\n\n';

    stringBuilder +=
      date
        .toLocaleDateString('ru-RU', {
          dateStyle: 'long',
        })
        .slice(0, -3) + '\n';
    stringBuilder +=
      document
        .querySelector(
          'body > main > div.wrap.days-layout.book-layout > div:nth-child(1) > div.h1.days__h1 > div > p'
        )
        ?.textContent?.replace(' (см. в «Богослужебных указаниях»)', '') +
      '\n\n';

    let i = 0;
    let currentTitle = null;
    while ((currentTitle = document.getElementById('reading-' + i))) {
      stringBuilder +=
        currentTitle.children[0].childNodes[0].textContent?.trim() +
        '\n' +
        currentTitle.children[0].childNodes[3].textContent?.trim() +
        '\n\n';

      const lines = [
        ...currentTitle.nextElementSibling!.getElementsByClassName('verse'),
      ];

      lines.forEach((line) => {
        stringBuilder += line.textContent?.trim().replace('\n', '') + '\n';
      });

      stringBuilder += '\n';

      i++;
      if (i >= 20) {
        console.error('Too many blocks');
        break;
      }
    }

    return stringBuilder.trim();
  } catch (e) {
    console.error(e);
    return null;
  }
}
