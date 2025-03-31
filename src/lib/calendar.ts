import { JSDOM } from 'jsdom';

export async function getCalendar() {
  try {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const res = await fetch(
      'https://azbyka.ru/days/' + formatDateToFetch(date)
    );
    const str = await res.text();
    const calendarEl = new JSDOM(str).window.document.getElementById(
      'calendar'
    );

    let stringBuilder = '#церковный_календарь\n\n' + formatDateToShow(date);

    const postEl = calendarEl?.getElementsByClassName('post')[0];
    if (postEl) {
      stringBuilder += '\n' + postEl.textContent?.trim();
    }

    const payloadEl = calendarEl?.getElementsByClassName('text day__text')[0];

    const preparagraphs = payloadEl?.getElementsByTagName('p');
    if (preparagraphs) {
      for (let i = 0; i < preparagraphs.length; i++) {
        stringBuilder += '\n';
        stringBuilder += preparagraphs[i].textContent
          ?.replace(/(\n|\t)/gm, '')
          ?.replace(/Глас.*/g, '')
          .trim();
      }
    }

    const ideograph = payloadEl?.getElementsByClassName('ideograph-0')[0];
    if (ideograph) {
      stringBuilder += '\n' + ideograph.textContent?.trim();
    }

    const paragraphs = payloadEl?.getElementsByTagName('ul');

    if (paragraphs) {
      stringBuilder += '\n';
      for (let i = 0; i < paragraphs.length; i++) {
        const lines = paragraphs[i].getElementsByTagName('li');
        if (lines && !lines[0].className.includes('ideograph-0')) {
          const linesTexts = [];
          for (let k = 0; k < lines.length; k++) {
            linesTexts.push(lines[k].textContent?.trim());
          }
          stringBuilder += '\n' + linesTexts.join('; ') + '.';
        }
      }
    }

    return stringBuilder;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function formatDateToFetch(date: Date) {
  return date
    .toLocaleDateString('ru-RU')
    .replace(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/, '$3-$2-$1');
}

function formatDateToShow(date: Date) {
  return (
    date
      .toLocaleDateString('ru-RU', {
        dateStyle: 'long',
      })
      .slice(0, -3) +
    ', ' +
    date.toLocaleDateString('ru-RU', {
      weekday: 'long',
    })
  );
}
