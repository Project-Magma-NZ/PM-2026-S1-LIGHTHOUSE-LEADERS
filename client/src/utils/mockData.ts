const generateMockPhoto = (seed: number) => {
    const palette = [
        ['#7f49b2', '#f4c542'],
        ['#2a9d8f', '#264653'],
        ['#e76f51', '#f4a261'],
        ['#457b9d', '#a8dadc'],
    ][seed % 4]

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Mock PhotoVoice image">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${palette[0]}" />
                    <stop offset="100%" stop-color="${palette[1]}" />
                </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#bg)" rx="36" />
            <circle cx="180" cy="170" r="110" fill="#ffffff" fill-opacity="0.14" />
            <circle cx="620" cy="420" r="150" fill="#ffffff" fill-opacity="0.12" />
            <path d="M110 470 C220 360, 340 520, 460 410 S680 330, 720 250" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="18" stroke-linecap="round" />
            <rect x="70" y="70" width="660" height="460" rx="28" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2" />
            <text x="400" y="275" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">PhotoVoice</text>
            <text x="400" y="335" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-family="Arial, sans-serif" font-size="24">Mock leadership reflection image</text>
        </svg>
    `

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`
}

export function generateMockSurveys(count: number) {
    const reflections = [
        {
            strengths: 'Leading our class recycling project and getting everyone involved.',
            goals: 'Being more confident when presenting to the whole school.',
            support: 'My teacher Ms. Smith and my friends in the environment club.',
        },
        {
            strengths: 'Organizing the school sports day and making it fun for everyone.',
            goals: 'Learning to manage my time better with homework and activities.',
            support: 'My parents and our sports coach Mr. Johnson.',
        },
    ]

    return Array.from({ length: count }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - ((count - i - 1) * 30 + Math.floor(Math.random() * 15)))
        const base = 3 + Math.random() * 2
        const variation = 0.5 + i * 0.3
        return {
            id: `survey-${i + 1}`,
            date: date.toISOString(),
            ratings: Object.fromEntries(
                ['vision', 'strategy', 'resources', 'risk', 'action', 'connection', 'purpose'].map(k => [
                    k, Math.min(7, Math.max(1, base + variation + (Math.random() - 0.5)))
                ])
            ),
            textResponses: reflections[i % reflections.length],
            photo: generateMockPhoto(i),
            caption: i % 2 === 0
                ? 'Building momentum by working together and taking action.'
                : 'A snapshot of growth, confidence, and support.',
        }
    })
}

export function generateMockUsers() {
    const names = [
        'Emma Smith', 'Liam Johnson', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
        'Isabella Garcia', 'Sophia Miller', 'Mason Davis', 'Lucas Rodriguez', 'Mia Martinez',
        'Ethan Hernandez', 'Charlotte Lopez', 'Amelia Wilson', 'Harper Anderson', 'Evelyn Thomas',
    ]
    return names.map((name, i) => {
        const [first, last] = name.split(' ')
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 90))
        return {
            id: `user-${i + 1}`,
            name,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@school.nz`,
            surveyCount: Math.floor(Math.random() * 4) + 1,
            latestSurveyDate: date.toISOString(),
            averageScore: 3 + Math.random() * 3.5,
        }
    })
}

export type MockAdminAnalyticsUserRow = {
    id: string
    userCode: string
    name: string
    school: string
    className: string
    survey1Score: number | null
    survey2Score: number | null
}

export function generateMockAdminAnalyticsUsers(count: number = 15): MockAdminAnalyticsUserRow[] {
    const schools = [
        { name: 'School 1', classes: ['10A', '10B', '9C', '9D'] },
        { name: 'School 2', classes: ['11A', '11B', '12A'] },
        { name: 'School 3', classes: ['8A', '8B', '8C'] },
    ]

    const roomPool = [
        'Room 1', 'Room 1', 'Room 1', 'Room 1',
        'Room 2', 'Room 2', 'Room 2',
        'Room 3',
        'Room 4', 'Room 4', 'Room 4', 'Room 4',
        'Room 5', 'Room 5',
        'Room 6', 'Room 6',
        'Room 10', 'Room 10',
        'Room 12', 'Room 12',
        'Room 12', 'Room 12', 'Room 12', 'Room 12', 'Room 12', 'Room 12',
        'Room 13',
        'Room 14',
        'Room 15', 'Room 15', 'Room 15', 'Room 15',
    ]
    const names = [
        'Emma Smith', 'Liam Johnson', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
        'Isabella Garcia', 'Sophia Miller', 'Mason Davis', 'Lucas Rodriguez', 'Mia Martinez',
        'Ethan Hernandez', 'Charlotte Lopez', 'Amelia Wilson', 'Harper Anderson', 'Evelyn Thomas',
        'James Taylor', 'Chloe Moore', 'Benjamin Clark', 'Grace Hall', 'Henry Young',
    ]

    const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

    return Array.from({ length: count }, (_, i) => {
        const name = names[i % names.length]
        const school = schools[i % schools.length]
        const className = roomPool[i % roomPool.length]

        // Generate plausible scores out of 7; sometimes missing (not completed)
        const hasSurvey1 = true
        const hasSurvey2 = Math.random() > 0.25

        const base = 3.2 + (i % 5) * 0.35 + (Math.random() - 0.5) * 0.4
        const s1 = hasSurvey1 ? clamp(base + (Math.random() - 0.5) * 0.6, 1, 7) : null
        const s2 = hasSurvey2 ? clamp((s1 ?? base) + (Math.random() - 0.3) * 0.8, 1, 7) : null

        return {
            id: `admin-user-${i + 1}`,
            userCode: `STU-${String(i + 1).padStart(4, '0')}`,
            name,
            school: school.name,
            className,
            survey1Score: s1 == null ? null : Number(s1.toFixed(1)),
            survey2Score: s2 == null ? null : Number(s2.toFixed(1)),
        }
    })
}
