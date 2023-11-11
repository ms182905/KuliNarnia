import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
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
        title: Yup.string().required('Recipe title is required'),
        description: Yup.string().required('Recipe description is required'),
        categoryId: Yup.string().required('Recipe category is required!'),
        tagIds: Yup.array().min(1).required('Select at least 1 tag'),
    });

    function handleFormSubmit(recipe: Recipe) {
        console.log(recipe);
        if (!recipe.id) recipe.id = uuid();
        //     createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        // } else {
        //     updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        // }
        updateRecipeData(recipe);
    }

    return (
        <>
            <Segment clearing>
                <Header content="Recipe Details" sub color="teal" />
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
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <MyTextInput placeholder="Title" name="title" />
                            <MyTextArea placeholder="Description" name="description" rows={3} />
                            <MySelectInput placeholder="Category" name="categoryId" options={categoriesList} />
                            <MyMultipleChoiceDropdownInput placeholder="Tags" name="tagIds" options={tagsList} />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                floated="right"
                                positive
                                type="submit"
                                content="Submit"
                            />
                            {/* <Button as={Link} to="/recipes" floated="right" type="button" content="Cancel" /> */}
                        </Form>
                    )}
                </Formik>
            </Segment>
        </>
    );
});
