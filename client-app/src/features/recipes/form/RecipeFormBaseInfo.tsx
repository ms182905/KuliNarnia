import { useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Recipe } from '../../../app/models/recipe';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyMultipleChoiceDropdownInput from '../../../app/common/form/MyMultipleChoiceDropdownInput';

export default observer(function RecipeFormBaseInfo() {
    const { recipeStore, categoryStore, tagStore } = useStore();
    const { updateRecipeData } = recipeStore;
    const { categoriesTable } = categoryStore;
    const { tagsTable } = tagStore;
    const [categoriesList, setCategoriesList] = useState<{ text: string; value: string }[]>([]);
    const [tagsList, setTagList] = useState<{ text: string; value: string; key: string }[]>([]);

    const [recipe, setRecipe] = useState<Recipe>({
        id: '',
        title: '',
        categoryId: '',
        description: '',
        date: '',
        creatorId: '',
        ingredients: [],
        instructions: [],
        tags: [],
        tagIds: [],
        comments: [],
    });

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
        if (recipeStore.selectedRecipe) setRecipe(recipeStore.selectedRecipe);
    }, [recipeStore.selectedRecipe]);

    const primaryDataValidationSchema = Yup.object({
        title: Yup.string().matches(/^[^\s].*$/, 'Tytuł nie może zaczynać sie od spacji'),
        description: Yup.string().matches(/^[^\s].*$/, 'Opis nie może zaczynać sie od spacji'),
    });

    function handleFormSubmit(recipe: Recipe) {
        if (!recipe.id) recipe.id = uuid();
        updateRecipeData(recipe);
    }

    return (
        <>
            <div className="card__content" style={{ display: 'block', padding: '14px', overflow: 'visible' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Informacje podstawowe</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    <Segment
                        attached
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '90%',
                            fontFamily: 'Andale Mono, monospace',
                            overflow: 'visible',
                        }}
                    >
                        <Formik
                            validationSchema={primaryDataValidationSchema}
                            enableReinitialize
                            initialValues={recipe}
                            onSubmit={(values, { resetForm }) => {
                                resetForm();
                                handleFormSubmit(values);
                            }}
                        >
                            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                                <Form
                                    className="ui form"
                                    onSubmit={handleSubmit}
                                    autoComplete="off"
                                    style={{ width: '100%' }}
                                >
                                    <MyTextInput placeholder="Tytuł" name="title" />
                                    <MyTextArea placeholder="Opis" name="description" rows={3} />
                                    <MySelectInput placeholder="Kategoria" name="categoryId" options={categoriesList} />
                                    <MyMultipleChoiceDropdownInput
                                        placeholder="Tagi"
                                        name="tagIds"
                                        options={tagsList}
                                    />
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        positive
                                        type="submit"
                                        content="Zatwierdź"
                                        fluid
                                        className="positiveButton"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </Segment>
                </div>
            </div>
        </>
    );
});
