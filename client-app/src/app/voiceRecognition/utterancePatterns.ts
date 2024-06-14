type UtterancePattern = {
    [key: string]: string[];
};

const utterancePatterns: UtterancePattern = {
    favourites: [
        "pokaż ulubione przepisy",
        "przejdź do ulubionych przepisów",
        "ulubione przepisy"
    ],
    recommendations: [
        "pokaż rekomendowane przepisy",
        "przejdź do rekomendowanych przepisów",
        "rekomendowane przepisy"
    ],
    browser: [
        "pokaż wszystkie przepisy",
        "przejdź do wyszukiwarki przepisów",
        "wszystkie przepisy"
    ],
    logout: [
        "wyloguj"
    ],
    category: [
        "pokaż przepisy z kategorii",
        "kategoria"
    ],
    tag: [
        "tag",
        "pokaż przepisy z tagiem"
    ],
    search: [
        "wyszukaj",
        "znajdź"
    ],
    my_profile: [
        "mój profil"
    ],
    my_recipes: [
        "moje przepisy",
        "przepisy dodane przeze mnie"
    ],
    add_recipe: [
        "dodaj przepis",
        "nowy przepis"
    ]
};

function determinePattern(utterance: string): string | null {
    const normalizedUtterance = utterance.toLowerCase();

    for (const category in utterancePatterns) {
        const patterns: string[] = utterancePatterns[category as keyof UtterancePattern];
        if (patterns.some(pattern => normalizedUtterance.includes(pattern))) {
            return category;
        }
    }

    return null;
}

export default determinePattern;