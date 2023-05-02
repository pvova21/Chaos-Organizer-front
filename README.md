# Chaos-Organizer-front
[![Build status](https://ci.appveyor.com/api/projects/status/aq8rs9bkmp7l9b8a?svg=true)](https://ci.appveyor.com/project/pvova21/chaos-organizer-front)
## [GitHub Pages](https://pvova21.github.io/Chaos-Organizer-front/)
# Реализованы функции: 
сохранение в истории ссылок и текстовых сообщений; 
ссылки (http:// или https://) должны быть кликабельны и отображаться, как ссылки; 
сохранение в истории изображений, видео и аудио (как файлов) — через Drag & Drop и через иконку загрузки; 
скачивание файлов на компьютер пользователя; 
ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т. д. 
# Реализованы дополнительные функции:
синхронизация: если приложение открыто в нескольких окнах или вкладках, то контент должен быть синхронизирован; 
запись и воспроизведение видео и аудио, используя API браузера; 
отправка геолокации по клику на кнопку в поле ввода; 
отправка команд боту:
    '/get usd' бот присылает действующий курс Доллара к Рублю;
    '/get eur' бот присылает действующий курс Евро к Рублю;
    '/get weather' бот присылает прогнозом погоды по координатам клиента; 
поддержка смайликов (emoji). 