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
            photo: null,
            caption: null,
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