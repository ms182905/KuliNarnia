import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownProps, Grid, Header, Input, Menu, Select } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

export default observer(function RecipeSearchElement() {
    const { categoryStore, tagStore } = useStore();
    //const {  } = recipeStore;
    const { categoriesTable, loadCategories } = categoryStore;
    const { tagsTable, loadTags } = tagStore;
    const [categoriesList, setCategoriesList] = useState<{ text: string; value: string }[]>([]);
    const [tagsList, setTagList] = useState<{ text: string; value: string; key: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>();

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
        if (categoriesList.length === 0) {
            loadCategories();
        }
        if (tagsList.length === 0) {
            loadTags();
        }
    }, [categoriesList, loadCategories, tagsList, loadTags]);

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
        console.log(selectedTags);
        console.log(selectedCategory);
    };

    const handleApplyFilters = () => {
        console.log('Searching for:', searchQuery);
        console.log(selectedTags);
        console.log(selectedCategory);
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
            <Menu fluid vertical size="small" style={{ width: '100%', marginTop: 12 }}>
                <Header icon="wordpress simple" attached color="teal" content="Search by phrase" />
                <Menu.Item>
                    <Grid columns={2}>
                        <Grid.Column width={14}>
                            <Input
                                fluid
                                icon="search"
                                placeholder="Search name..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid type="button" content="Search" color="green" onClick={handleSearch} />
                        </Grid.Column>
                    </Grid>
                </Menu.Item>
            </Menu>

            <Menu fluid vertical size="small" style={{ width: '100%', marginTop: 12 }}>
                <Header icon="filter" attached color="teal" content="Filters" />
                <Menu.Item>
                    <Grid columns={2}>
                        <Grid.Column width={7}>
                            <Dropdown
                                fluid
                                clearable
                                options={tagsList}
                                value={selectedTags}
                                onChange={handleTagDropdownChange}
                                placeholder="Select tags"
                                multiple
                                selection
                            />
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Select
                                fluid
                                clearable
                                options={categoriesList}
                                placeholder="Select category"
                                value={selectedCategory}
                                onChange={handleCategorySelectChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid type="button" content="Apply" color="green" onClick={handleApplyFilters} />
                        </Grid.Column>
                    </Grid>
                </Menu.Item>
            </Menu>
            <Header />
        </>
    );
});