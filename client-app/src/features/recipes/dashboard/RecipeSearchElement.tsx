import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownProps, Grid, Header, Input, Menu, Select } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

export default observer(function RecipeSearchElement() {
    const { categoryStore, tagStore, recipeStore, listenButtonStore } = useStore();
    const { resetFilters, setSearchQuerry, setFilters, reset, resetSearchQuerry } = recipeStore;
    const { setCategoryCallback, setPhraseCallback, setTagCallback, setClearCriteriaCallback } = listenButtonStore;
    const { categoriesTable, loadCategories } = categoryStore;
    const { tagsTable, loadTags } = tagStore;
    const [categoriesList, setCategoriesList] = useState<{ text: string; value: string }[]>([]);
    const [tagsList, setTagList] = useState<{ text: string; value: string; key: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState(recipeStore.searchQuery);
    const [selectedTags, setSelectedTags] = useState<string[]>(recipeStore.selectedTags);
    const [selectedCategory, setSelectedCategory] = useState<string>(recipeStore.selectedCategory);

    useEffect(() => {
        if (categoriesTable.length > 0) {
            const tempCategories: { text: string; value: string }[] = [];
            categoriesTable.forEach((s) =>
                tempCategories.push({ text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id })
            );
            tempCategories.sort((a, b) => a.text.localeCompare(b.text));
            setCategoriesList(tempCategories);
        }
    }, [categoriesTable]);

    const handleApplyFilters = () => {
        if (
            selectedTags.length > 0 ||
            selectedCategory.length > 0 ||
            recipeStore.recipeRegistry.size === 0 ||
            (recipeStore.selectedCategory.length > 0 && recipeStore.selectedCategory !== selectedCategory) ||
            (recipeStore.selectedTags.length > 0 && recipeStore.selectedTags !== selectedTags)
        ) {
            setFilters(selectedCategory, selectedTags);
            reset();
        }
    };

    const handleClearFilters = () => {
        if (
            recipeStore.recipeRegistry.size < 1 ||
            recipeStore.selectedCategory.length > 0 ||
            recipeStore.selectedTags.length > 0
        ) {
            setSelectedTags([]);
            setSelectedCategory('');

            resetFilters();
            reset();
        }
    };

    useEffect(() => setCategoryCallback((categoryName: string) => {
        const normalizedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
        const foundCategory = categoriesList.find(category => category.text === normalizedCategoryName);

        if (foundCategory) {
            recipeStore.selectedCategory = foundCategory.value;
            recipeStore.reset();
        } else {
            console.log("No matching category found for:", normalizedCategoryName);
        }
    }));

    useEffect(() => setPhraseCallback((phrase: string) => {
        recipeStore.searchQuery = phrase;
        recipeStore.reset();
    }));

    useEffect(() => setClearCriteriaCallback(() => {
        recipeStore.searchQuery = '';
        recipeStore.selectedCategory = '';
        recipeStore.selectedTags = [];
        recipeStore.reset();
    }));

    useEffect(() => setTagCallback((tagName: string) => {
        const normalizedTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1).toLowerCase();
        const foundTag = tagsList.find(tag => tag.text === normalizedTagName);

        if (foundTag) {
            recipeStore.selectedTags.push(foundTag.value);
            recipeStore.reset();
        } else {
            console.log("No matching tag found for:", normalizedTagName);
        }
    }));


    useEffect(() => {
        if (tagsTable.length > 0) {
            const tempTags: { text: string; value: string; key: string }[] = [];
            tagsTable.forEach((s) =>
                tempTags.push({ text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id, key: s.name })
            );
            tempTags.sort((a, b) => a.text.localeCompare(b.text));
            setTagList(tempTags);
        }
    }, [tagsTable]);

    useEffect(() => {
        if (categoriesList.length < 1) {
            loadCategories();
        }
        if (tagsList.length < 1) {
            loadTags();
        }
    }, [categoriesList, loadCategories, tagsList, loadTags]);

    const handleSearch = () => {
        if (searchQuery.length !== 0 || recipeStore.recipeRegistry.size === 0) {
            setSearchQuerry(searchQuery);
            reset();
        }
    };

    const handleClearSearch = () => {
        if (searchQuery.length !== 0 || recipeStore.recipeRegistry.size === 0) {
            setSearchQuery('');
            resetSearchQuerry();
            reset();
        }
    };

    const handleTagDropdownChange = (_event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const selectedValues = data.value as string[];

        setSelectedTags(selectedValues);
    };

    const handleCategorySelectChange = (_event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        setSelectedCategory(data.value as string);
    };

    return (
        <>
            <Menu
                fluid
                vertical
                size="small"
                style={{ width: '100%', marginTop: '0.5em', marginBottom: '1em', borderRadius: '1em' }}
            >
                <Header
                    className="filter-header"
                    icon="wordpress simple"
                    attached
                    color="black"
                    content="Szukaj nazwy"
                    style={{ borderTopLeftRadius: '1em', borderTopRightRadius: '1em' }}
                />
                <Menu.Item>
                    <Grid columns={2}>
                        <Grid.Column width={12}>
                            <Input
                                className="userSearchInput"
                                fluid
                                icon="search"
                                placeholder="Szukaj nazwy..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button className="positiveButton" fluid content="Szukaj" onClick={handleSearch} />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid className="negativeButton" content="Wyczyść" onClick={handleClearSearch} />
                        </Grid.Column>
                    </Grid>
                </Menu.Item>
            </Menu>

            <Menu
                fluid
                vertical
                size="small"
                style={{ width: '100%', marginTop: '0.5em', marginBottom: '1em', borderRadius: '1em' }}
            >
                <Header
                    className="filter-header"
                    icon="filter"
                    attached
                    content="Filtry"
                    style={{ borderTopLeftRadius: '1em', borderTopRightRadius: '1em' }}
                />
                <Menu.Item>
                    <Grid columns={2}>
                        <Grid.Column width={6}>
                            <Dropdown
                                fluid
                                clearable
                                options={tagsList}
                                value={selectedTags}
                                onChange={handleTagDropdownChange}
                                placeholder="Wybierz tagi"
                                multiple
                                selection
                                style={{ borderRadius: '1em' }}
                            />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Select
                                fluid
                                clearable
                                options={categoriesList}
                                placeholder="Wybierz kategorię"
                                value={selectedCategory}
                                onChange={handleCategorySelectChange}
                                style={{ borderRadius: '1em' }}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button className="positiveButton" fluid content="Zastosuj" onClick={handleApplyFilters} />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid className="negativeButton" content="Wyczyść" onClick={handleClearFilters} />
                        </Grid.Column>
                    </Grid>
                </Menu.Item>
            </Menu>
        </>
    );
});
