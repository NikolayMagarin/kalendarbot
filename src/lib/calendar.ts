import { JSDOM } from 'jsdom';

export async function getCalendar() {
  try {
    const res = await fetch('https://t.me/s/avcalendar');
    const str = await res.text();
    const document = new JSDOM(str).window.document;

    const calendarElements = document.getElementsByClassName(
      'tgme_widget_message_text'
    );

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrowString = date
      .toLocaleDateString('ru-RU', {
        dateStyle: 'long',
      })
      .slice(0, -3);

    const lastCalendarElement = calendarElements.item(
      calendarElements.length - 1
    );

    function isTomorrow(str: string | null | undefined) {
      if (!str) return false;
      const tomorrowStringParts = tomorrowString.split(' ');
      return (
        str.includes(tomorrowStringParts[0]) &&
        str.includes(tomorrowStringParts[1]) &&
        str.includes(tomorrowStringParts[2])
      );
    }

    const calendarElement = isTomorrow(lastCalendarElement?.textContent)
      ? lastCalendarElement
      : [...calendarElements].find((el) => isTomorrow(el.textContent)) || null;

    if (!calendarElement) {
      return null;
    }

    let stringBuilder = '';
    let paragraphsCounter = 0;
    let lastWasBR = false;

    for (const childNode of calendarElement.childNodes) {
      if (childNode.nodeType === childNode.ELEMENT_NODE) {
        const element = childNode as Element;
        if (element.tagName === 'A') {
          if (isTomorrow(element.textContent)) {
            stringBuilder +=
              tomorrowString +
              ', ' +
              date.toLocaleDateString('ru-RU', {
                weekday: 'long',
              });
          } else {
            stringBuilder += element.textContent;
          }
          lastWasBR = false;
        } else if (element.tagName === 'BR') {
          if (lastWasBR) {
            if (paragraphsCounter < 2) {
              paragraphsCounter++;
            } else {
              break;
            }
          }
          stringBuilder += '\n';
          lastWasBR = true;
        }
      } else if (childNode.nodeType === childNode.TEXT_NODE) {
        stringBuilder += childNode.textContent;
        lastWasBR = false;
      }
    }

    return (
      '#церковный_календарь\n\n' +
      stringBuilder
        .trim()
        .replace(/(Постный день\.|Поста нет\.).*/, '$1')
        .replace('\nПостный день', 'Постный день')
        .replace('\nПоста нет', 'Поста нет')
        .replace('Богослужебные указания.\n', '')
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}
