import CustomHeader from "@/components/ui/CustomHeader";

import { COLORS } from "@/constants/Colors";
import { categories, EXHIBIT_RATINGS, MUSEUM_EXHIBITS } from "@/lib/data";
import { ThematicCategories } from "@/server/generated/prisma";
import { CategoryGroupType, ExhibitType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SearchedExhibitCard from "../ui/SearchedExhibitCard";
import FilteredTab from "../ui/FilteredTab";

// ! Filter types
type FilterType = "all" | "chronological" | "thematic";

interface SearchExhibitsScreenProps {
  exhibits: ExhibitType[];
  thematicCategories: CategoryGroupType[];
  chronologicalCategories: CategoryGroupType[];
}

export default function SearchExhibitsScreen({
  exhibits,
  thematicCategories,
  chronologicalCategories,
}: SearchExhibitsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeCategory, setActiveCategory] = useState<
    ThematicCategories | "all"
  >("all");

  const [filteredExhibits, setFilteredExhibits] =
    useState<ExhibitType[]>(exhibits);

  const [recommendedExhibits, setRecommendedExhibits] = useState<ExhibitType[]>(
    []
  );

  // ! Initialize recommended exhibits
  useEffect(() => {
    // In a real app, this would be personalized based on user preferences
    // For now, we'll just show the highest rated exhibits
    const highestRated = [...exhibits]
      .sort((a, b) => {
        const ratingA = EXHIBIT_RATINGS[a.id]?.rating || 0;
        const ratingB = EXHIBIT_RATINGS[b.id]?.rating || 0;
        return ratingB - ratingA;
      })
      .slice(0, 3);

    setRecommendedExhibits(highestRated);
  }, []);

  // ! Debounced search function
  const debouncedSearch = useCallback(
    debounce(
      (
        query: string,
        filter: FilterType,
        category: ThematicCategories | "all"
      ) => {
        let results = [...exhibits];

        // Filter by search query
        if (query) {
          results = results.filter(
            (exhibit) =>
              exhibit.title.toLowerCase().includes(query.toLowerCase()) ||
              (exhibit.thematic_category &&
                exhibit.thematic_category
                  .toLowerCase()
                  .includes(query.toLowerCase())) ||
              exhibit.description.toLowerCase().includes(query.toLowerCase())
          );
        }

        // ! Apply category filter
        if (category !== "all") {
          results = results.filter(
            (exhibit) => exhibit.thematic_category === category
          );
        }

        // Apply chronological/thematic filter
        if (filter === "chronological") {
          // For chronological, we'll use the periods defined above
          const allChronologicalExhibitIds = chronologicalCategories.flatMap(
            (period) => period.exhibits
          );
          results = results.filter((exhibit) =>
            allChronologicalExhibitIds.includes(exhibit.id)
          );
        } else if (filter === "thematic") {
          // For thematic, we'll use the categories defined above
          const allThematicExhibitIds = thematicCategories.flatMap(
            (category) => category.exhibits
          );
          results = results.filter((exhibit) =>
            allThematicExhibitIds.includes(exhibit.id)
          );
        }

        setFilteredExhibits(results);
      },
      300
    ),
    []
  );

  // ! Update search results when query or filters change
  useEffect(() => {
    debouncedSearch(searchQuery, activeFilter, activeCategory);
  }, [searchQuery, activeFilter, activeCategory, debouncedSearch]);

  return (
    <View className="flex-1 bg-background relative">
      {/* custom header */}
      <CustomHeader type="exhibit" content="Search Exhibits" />

      <ScrollView className="flex-1">
        <View className="h-[100px]" />
        <View className="px-4 pt-4 pb-20">
          {/* Search Bar */}
          <View className="bg-white dark:bg-black rounded-lg shadow-sm mb-4">
            <View className="flex-row items-center px-3 py-2">
              <Ionicons name="search" size={20} color="#6366f1" />
              <TextInput
                className="flex-1 ml-2 text-foreground"
                placeholder="Search exhibits, artists, categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.light.primary}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Background Image */}
          <View className="relative rounded-lg overflow-hidden mb-6">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?q=80&w=2070",
              }}
              className="w-full h-[150px]"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 justify-center px-4">
              <Text className="text-white text-xl font-bold mb-2">
                Discover Our Collection
              </Text>
              <Text className="text-white/90">
                Explore {MUSEUM_EXHIBITS.length} exhibits across different time
                periods and themes
              </Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View className="mb-6">
            <Text className="text-foreground text-lg font-semibold mb-3">
              Browse By
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <TouchableOpacity
                onPress={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full mr-2 ${activeFilter === "all" ? "bg-primary" : "bg-white dark:bg-black"}`}
              >
                <Text
                  className={
                    activeFilter === "all"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveFilter("chronological")}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeFilter === "chronological" ? "bg-primary" : "bg-white dark:bg-black"
                }`}
              >
                <Text
                  className={
                    activeFilter === "chronological"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                >
                  Chronological
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveFilter("thematic")}
                className={`px-4 py-2 rounded-full mr-2 ${activeFilter === "thematic" ? "bg-primary" : "bg-white dark:bg-black"}`}
              >
                <Text
                  className={
                    activeFilter === "thematic"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                >
                  Thematic
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeCategory === "all"
                    ? "bg-primary/10 border border-primary"
                    : "bg-white"
                }`}
              >
                <Text
                  className={
                    activeCategory === "all"
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => {
                    console.log("category and active", category.name);
                    setActiveCategory(
                      category.name as ThematicCategories
                    )
                  }
                  }
                  className={`px-4 py-2 rounded-full mr-2 ${
                    activeCategory === category.name
                      ? "bg-primary/20 border border-primary"
                      : "bg-white dark:bg-black"
                  }`}
                >
                  <Text
                    className={
                      activeCategory === category.name
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {activeFilter === "chronological" && (
            <FilteredTab 
              filteredExhibits={chronologicalCategories}
              setFilteredExhibits={setFilteredExhibits}
              exhibits={exhibits}
            />
          )}

          {activeFilter === "thematic" && (
            <FilteredTab
              filteredExhibits={thematicCategories}
              setFilteredExhibits={setFilteredExhibits}
              exhibits={exhibits}
            />
          )}

          {/* Recommended Exhibits (only show when no search query) */}
          {!searchQuery &&
            activeFilter === "all" &&
            activeCategory === "all" && (
              <View className="mb-6">
                <Text className="text-foreground text-lg font-semibold mb-3">
                  Recommended For You
                </Text>
                {recommendedExhibits.map((exhibit) => (
                  <SearchedExhibitCard key={exhibit.id} item={exhibit} />
                ))}
              </View>
            )}

          {/* Search Results */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-foreground text-lg font-semibold">
                {searchQuery ? "Search Results" : "All Exhibits"}
              </Text>
              <Text className="text-gray-400">
                {filteredExhibits.length} found
              </Text>
            </View>

            {filteredExhibits.length > 0 ? (
              filteredExhibits.map((exhibit) => (
                <SearchedExhibitCard key={exhibit.id} item={exhibit} />
              ))
            ) : (
              <View className="bg-white rounded-lg p-6 items-center">
                <Ionicons
                  name="search-outline"
                  size={50}
                  color={COLORS.light.primary}
                />
                <Text className="text-foreground text-lg font-medium mt-4">
                  No exhibits found
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Try adjusting your search or filters to find what you are
                  looking for
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                    setActiveCategory("all");
                  }}
                  className="bg-primary mt-4 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">Clear Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
