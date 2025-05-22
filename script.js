const schedule = [
    {
        name: "Greycat & Aegis",
        timestamp: 1747324800, // May 15, 2025 08:00 UTC
        end: 1747497600,
        location: "Bevic Convention Center, Area 18",
        participants: "GREYCAT INDUSTRIAL, AEGIS DYNAMICS",
        limitedSales: "Aegis Idris-P, Aegis Javelin",
        waveTimestamps: [
            1747324800,              // Wave 1: 08:00 UTC (May 15)
            1747353600,              // Wave 2: 16:00 UTC (May 15)
            1747382400,              // Wave 3: 00:00 UTC (May 16)
            1747411200,              // Wave 4: 08:00 UTC (May 16)
            1747440000,              // Wave 5: 16:00 UTC (May 16)
            1747468800               // Wave 6: 00:00 UTC (May 17)
        ]
    },
    {
        name: "Origin, RSI & Argo",
        timestamp: 1747497600, // May 17, 2025 08:00 UTC
        end: 1747670400,
        location: "Bevic Convention Center, Area 18",
        participants: "ORIGIN JUMPWORKS, ROBERTS SPACE INDUSTRIES, ARGO ASTRONAUTICS",
        limitedSales: "RSI Constellation Phoenix",
        waveTimestamps: [
            1747497600,              // Wave 1: 08:00 UTC (May 17)
            1747526400,              // Wave 2: 16:00 UTC (May 17)
            1747555200,              // Wave 3: 00:00 UTC (May 18)
            1747584000,              // Wave 4: 08:00 UTC (May 18)
            1747612800,              // Wave 5: 16:00 UTC (May 18)
            1747641600               // Wave 6: 00:00 UTC (May 19)
        ]
    },
    {
        name: "Consolidated Outland, MISC & Mirai",
        timestamp: 1747670400,
        end: 1747843200,
        location: "Bevic Convention Center, Area 18",
        participants: "CONSOLIDATED OUTLAND, MISC, MIRAI"
    },
    {
        name: "Crusader & Tumbril",
        timestamp: 1747843200,
        end: 1748016000,
        location: "Bevic Convention Center, Area 18",
        participants: "CRUSADER INDUSTRIES, TUMBRIL LAND SYSTEMS"
    },
     {
        name: "Anvil Aerospace",
        timestamp: 1748016000, // May 23, 2025 08:00 UTC
        end: 1748188800,       // May 25, 2025 09:00 UTC
        location: "Bevic Convention Center, Area 18",
        participants: "ANVIL AEROSPACE"
    },
    {
        name: "Special Idris Resale",
        timestamp: 1748016000, // Starts with Anvil — May 23, 2025 @ 09:00 UTC
        end: 1748102400,        // May 24, 2025 @ 09:00 UTC
        location: "Pledge Store",
        participants: "AEGIS DYNAMICS",
        limitedSales: "Aegis Idris-P",
        waveTimestamps: [
            1748016000, // Wave 1: 09:00 UTC (May 23)
            1748030400, // Wave 2: 13:00 UTC
            1748044800, // Wave 3: 17:00 UTC
            1748059200, // Wave 4: 21:00 UTC
            1748073600, // Wave 5: 01:00 UTC (May 24)
            1748088000  // Wave 6: 05:00 UTC (May 24)
            ]
    },
    {
        name: "Drake",
        timestamp: 1748188800, // May 25, 2025 09:00 UTC
        end: 1748260800,       // May 26, 2025 08:00 UTC
        location: "Bevic Convention Center, Area 18",
        participants: "DRAKE INTERPLANETARY",
        limitedSales: "Drake Kraken, Drake Kraken Privateer",
        waveTimestamps: [
            1748188800, // Wave 1: 09:00 UTC (May 25)
            1748217600, // Wave 2: 17:00 UTC (May 25)
            1748246400, // Wave 3: 01:00 UTC (May 26)
            1748275200, // Wave 4: 09:00 UTC (May 26)
            1748304000, // Wave 5: 17:00 UTC (May 26)
            1748332800  // Wave 6: 01:00 UTC (May 27)
        ]
    },
    {
        name: "Invictus Finale",
        timestamp: 1748275200, // May 26, 2025 @ 06:20 UTC
        end: 1748448000,       // May 28, 2025 @ 06:20 UTC
        location: "Bevic Convention Center, Area 18",
        participants: "ALL MANUFACTURERS",
        limitedSales: "All Limited Ships from Every Manufacturer",
        waveTimestamps: [
            1748275200, // Wave 1 – May 26 @ 06:20 UTC
            1748304000, // Wave 2 – May 26 @ 14:20 UTC
            1748332800  // Wave 3 – May 27 @ 22:20 UTC
    ]
    }
];

function populateTimeZones() {
    const timeZones = Intl.supportedValuesOf('timeZone');
    const selector = document.getElementById('timezone-selector');
    timeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone;
        option.textContent = zone;
        selector.appendChild(option);
    });
    selector.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone-info').textContent = `Your timezone is ${selector.value} and the schedule is based on that.`;
}

function convertTimestampToLocaleString(timestamp, timeZone) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', { timeZone, hour12: true });
}

function getTimeLeft(timestamp, endTimestamp) {
    const now = new Date().getTime() / 1000;
    let timeUntilStart = timestamp - now;
    let timeUntilEnd = endTimestamp ? endTimestamp - now : null;

    return {
        text: calculateTimeLeft(Math.max(timeUntilStart, 0)),
        timeUntilEnd: timeUntilEnd ? calculateTimeLeft(timeUntilEnd) : null,
        isHappening: now >= timestamp && (!endTimestamp || now <= endTimestamp),
        hasPassed: endTimestamp ? now > endTimestamp : false
    };
}

function calculateTimeLeft(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);

    let timeLeftText;
    if (days > 0) {
        timeLeftText = `${days}d:${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m`;
    } else {
        timeLeftText = `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${secondsLeft.toString().padStart(2, '0')}s`;
    }
    return timeLeftText;
}

function updateSchedule() {
    const now = new Date().getTime() / 1000;

    function getWaveStatus(waveTimestamp, nextWaveTimestamp) {
        if (now >= waveTimestamp && (nextWaveTimestamp === undefined || now < nextWaveTimestamp)) {
            return 'Started. Good Luck!';
        } else if (now < waveTimestamp) {
            return 'Upcoming';
        } else {
            return 'Passed';
        }
    }

    const selectedTimeZone = document.getElementById('timezone-selector').value;
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';

    schedule.forEach((event, index) => {
        const nextEventTimestamp = (index < schedule.length - 1) ? schedule[index + 1].timestamp : null;
        const eventTimeLeft = getTimeLeft(event.timestamp, nextEventTimestamp, event.end);

        let eventHTML = `<div class="event${eventTimeLeft.hasPassed ? ' finished-event' : ''}">`;

        if (eventTimeLeft.isHappening) {
            eventHTML = `<div class="event event-active">`;
            const endTime = event.end ? event.end : event.timestamp + 48 * 3600;
            const timeLeftToEnd = endTime - (new Date().getTime() / 1000);

            let timeLeftText;
            if (timeLeftToEnd > 0) {
                timeLeftText = calculateTimeLeft(timeLeftToEnd);
            } else {
                timeLeftText = 'Finished';
            }

            eventHTML += `<div class="event-name happening-now">${event.name}<br><span class="location-small">Happening Now in ${event.location}</span><span class="time-left">${timeLeftText}</span></div>`;

        } else if (eventTimeLeft.hasPassed) {
            eventHTML += `<div class="event-name finished">${event.name} - Finished</div>`;
        } else {
            const diffInSeconds = event.timestamp - (new Date().getTime() / 1000);
            if (diffInSeconds > 0 && diffInSeconds <= 86400) {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">Event starting soon in: ${eventTimeLeft.text} at ${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            } else {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            }
        }

        if (event.limitedSales) {
            let limitedSalesLinks = '';

            if (event.limitedSales === 'All Limited Ships from Every Manufacturer') {
                limitedSalesLinks = `<a href="https://robertsspaceindustries.com/en/store/pledge/browse/extras/?search=&sort=weight&direction=desc" class="limited-sales-link" target="_blank">${event.limitedSales}</a>`;
            } else {
                const sales = event.limitedSales.split(', ');
                sales.forEach(sale => {
                    let link = '';
                    switch (sale) {
                        case 'RSI Constellation Phoenix':
                            link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=phoenix&sort=weight&direction=desc';
                            break;
                        case 'Aegis Idris-P':
                            link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=idris&sort=weight&direction=desc';
                            break;
                        case 'Aegis Javelin':
                            link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=javelin&sort=weight&direction=desc';
                            break;
                        case 'Drake Kraken':
                        case 'Drake Kraken Privateer':
                            link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken&sort=weight&direction=desc';
                            break;
                    }
                    if (link) {
                        limitedSalesLinks += `<a href="${link}" class="limited-sales-link" target="_blank">${sale}</a>, `;
                    } else {
                        limitedSalesLinks += `${sale}, `;
                    }
                });
                limitedSalesLinks = limitedSalesLinks.slice(0, -2); // remove trailing comma and space
            }

            eventHTML += `<div class="limited-sales">Limited Ship Sales: ${limitedSalesLinks}</div>`;

            let lastWaveStatus = '';
            if (event.waveTimestamps) {
                event.waveTimestamps.forEach((waveTimestamp, waveIndex) => {
                    const nextWaveTimestamp = (waveIndex < event.waveTimestamps.length - 1) ?
                        event.waveTimestamps[waveIndex + 1] :
                        (nextEventTimestamp ? nextEventTimestamp : Number.MAX_SAFE_INTEGER);
                    const waveTimeLeft = getTimeLeft(waveTimestamp, nextWaveTimestamp);

                    let waveStatus;
                    if (waveTimeLeft.isHappening) {
                        waveStatus = `Wave ${waveIndex + 1}: <span class="wave-happening-now">Started. Good Luck!</span>`;
                        if (lastWaveStatus === 'Happening') {
                            eventHTML = eventHTML.replace(
                                `Wave ${waveIndex}: <span class="wave-happening-now">Started. Good Luck!</span>`,
                                `Wave ${waveIndex}: <span class="finished-wave">Passed</span>`
                            );
                        }
                        lastWaveStatus = 'Happening';
                    } else if (waveTimeLeft.hasPassed) {
                        waveStatus = `Wave ${waveIndex + 1}: <span class="finished-wave">Passed</span>`;
                        lastWaveStatus = 'Passed';
                    } else {
                        waveStatus = `Wave ${waveIndex + 1}: ${waveTimeLeft.text}`;
                        lastWaveStatus = 'Upcoming';
                    }

                    eventHTML += `<div class="wave">${waveStatus}</div>`;
                });
            }
        }

        eventHTML += `</div>`;
        scheduleContainer.innerHTML += eventHTML;
    });
}

window.onload = () => {
  populateTimeZones();
  updateSchedule();
  setInterval(updateSchedule, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'copyToDiscord') {
    copyToDiscord();
  }
};

function copyToDiscord() {
    const discordSchedule = `Invictus Launch Week 2955 Official Schedule:\n\n` +
        `**Greycat & Aegis:**\n<t:1747324800:f> [Bevic Convention Center, Area 18 <t:1747324800:R>]\n` +
        `Limited Ship Sales: Aegis Idris-P, Aegis Javelin\n` +
        `Wave 1: <t:1747324800:T>, Wave 2: <t:1747353600:T>, Wave 3: <t:1747382400:T>, Wave 4: <t:1747411200:T>, Wave 5: <t:1747440000:T>, Wave 6: <t:1747468800:T>\n\n` +

        `**Origin, RSI & Argo:**\n<t:1747497600:f> [Bevic Convention Center, Area 18 <t:1747497600:R>]\n` +
        `Limited Ship Sales: RSI Constellation Phoenix\n` +
        `Wave 1: <t:1747497600:T>, Wave 2: <t:1747526400:T>, Wave 3: <t:1747555200:T>, Wave 4: <t:1747584000:T>, Wave 5: <t:1747612800:T>, Wave 6: <t:1747641600:T>\n\n` +

        `**Consolidated Outland, MISC & Mirai:**\n<t:1747670400:f> [Bevic Convention Center, Area 18 <t:1747670400:R>]\n\n` +

        `**Crusader & Tumbril:**\n<t:1747843200:f> [Bevic Convention Center, Area 18 <t:1747843200:R>]\n\n` +

        `**Anvil Aerospace:**\n<t:1748016000:f> [Bevic Convention Center, Area 18 <t:1748016000:R>]\n\n` +

        `**↳ Special Aegis Idris Resale (4-hour Waves):**\nLimited Ship Sales: Aegis Idris-P\n` +
        `Wave 1: <t:1748016000:T>, Wave 2: <t:1748030400:T>, Wave 3: <t:1748044800:T>, Wave 4: <t:1748059200:T>, Wave 5: <t:1748073600:T>, Wave 6: <t:1748088000:T>\n\n` +

        `**Drake Defensecon:**\n<t:1748188800:f> [Bevic Convention Center, Area 18 <t:1748188800:R>]\n` +
        `Limited Ship Sales: Drake Kraken, Drake Kraken Privateer\n` +
        `Wave 1: <t:1748188800:T>, Wave 2: <t:1748217600:T>, Wave 3: <t:1748246400:T>, Wave 4: <t:1748275200:T>, Wave 5: <t:1748304000:T>, Wave 6: <t:1748332800:T>\n\n` +

        `**Invictus Finale – All Manufacturers Restock:**\n<t:1748275200:f> [Bevic Convention Center, Area 18 <t:1748275200:R>]\n` +
        `Limited Ship Sales: [All Limited Ships from Every Manufacturer](https://robertsspaceindustries.com/en/store/pledge/browse/extras/?search=&sort=weight&direction=desc)\n` +
        `Wave 1: <t:1748275200:T>, Wave 2: <t:1748304000:T>, Wave 3: <t:1748332800:T>\n` +
        `End of Invictus Launch Week 2955: <t:1748448000:f> [Bevic Convention Center, Area 18 <t:1748448000:R>]`;

    navigator.clipboard.writeText(discordSchedule).then(() => {
        document.getElementById('copyToDiscordBtn').innerText = 'Copied schedule in Discord format';
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
