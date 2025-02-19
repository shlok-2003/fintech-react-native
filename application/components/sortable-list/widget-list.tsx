import React from "react";
import { View } from "react-native";

import { MARGIN } from "./config";
import Tile from "./tile";
import SortableList from "./sortable-list";

interface ITile {
    id: string;
}

const tiles: ITile[] = [
    {
        id: "spent",
    },
    {
        id: "cashback",
    },
    {
        id: "recent",
    },
    {
        id: "cards",
    },
];

export default function WidgetList() {
    return (
        <View
            style={{
                paddingHorizontal: MARGIN,
                marginBottom: 80,
            }}
        >
            <SortableList
                editing={true}
                onDragEnd={(positions) =>
                    console.log(JSON.stringify(positions, null, 2))
                }
            >
                {[...tiles].map((tile, index) => (
                    <Tile
                        onLongPress={() => true}
                        key={tile.id + "-" + index}
                        id={tile.id}
                    />
                ))}
            </SortableList>
        </View>
    );
}
