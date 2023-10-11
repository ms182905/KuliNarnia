import React from "react";
import { Header, Menu } from "semantic-ui-react";

export default function RecipeFilters() {
    return (
        <>
            <Menu vertical size='large' style={{width: '100%', marginTop: 12}}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item content='All recipes' />
                <Menu.Item content="Category 1" />
                <Menu.Item content="Category 2" />
                <Menu.Item content="Category 3" />
                <Menu.Item content="Category 4" />
                <Menu.Item content="Category 5" />
            </Menu>
            <Header />

        </>
    )
}