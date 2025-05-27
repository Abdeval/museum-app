import CustomHeader from "@/components/ui/CustomHeader";

import { COLORS } from "@/constants/Colors";
import { categories, EXHIBIT_RATINGS } from "@/lib/data";
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
import { useTranslation } from "react-i18next";
import LRView from "../ui/LRView";
import TransText from "../ui/TransText";
import { useSession } from "@/context/AuthProvider";
import MaintenanceScreen from "./MaintenanceScreen";

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
  const { user } = useSession();

  // ! initializing the state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeCategory, setActiveCategory] = useState<
    ThematicCategories | "all"
  >("all");
  const { t, i18n } = useTranslation();

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
          results = results.filter((exhibit) => {
            // console.log(exhibit.thematic_category ,category);
            return exhibit.thematic_category === category;
          });
        }

        // console.log("result: ", results);

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

  if (!user) return <MaintenanceScreen />;

  return (
    <View className="flex-1 bg-background relative">
      {/* custom header */}
      <CustomHeader type="exhibit" content="exhibits" />

      <ScrollView className="flex-1">
        <View className="h-[100px]" />
        <View className="px-4 pt-4 pb-20">
          {/* Search Bar */}
          <View className="bg-white dark:bg-black rounded-lg shadow-sm mb-4">
            <LRView className="items-center px-3 py-2 gap-2">
              <Ionicons name="search" size={20} color="#6366f1" />
              <TextInput
                className="flex-1 ml-2 text-foreground"
                placeholder={t("search.inputPlaceholder")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.light.primary}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </LRView>
          </View>

          {/* Background Image */}
          <View className="relative rounded-lg overflow-hidden mb-6">
            <Image
              source={require("@/assets/images/searching.jpg")}
              className="w-full h-[150px]"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 justify-center px-4">
              <LRView>
                <TransText
                  title="search.discover"
                  className="text-primary-foreground text-xl font-bold mb-2"
                />
              </LRView>
              <LRView>
                <TransText
                  title="search.description"
                  number={exhibits?.length || 0}
                  className="text-primary-foreground"
                />
              </LRView>
            </View>
          </View>

          {/* Filter Tabs */}
          <View className="mb-6">
            <LRView className="pr-4">
              <TransText
                title="search.browse"
                className="text-foreground text-xl font-semibold mb-3"
              />
            </LRView>

            <LRView className="mb-4">
              <TouchableOpacity
                onPress={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full mr-2 ${activeFilter === "all" ? "bg-primary" : "bg-white dark:bg-black"}`}
              >
                <TransText
                  title="search.categories.all"
                  className={
                    activeFilter === "all"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveFilter("chronological")}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeFilter === "chronological"
                    ? "bg-primary"
                    : "bg-white dark:bg-black"
                }`}
              >
                <TransText
                  title="search.categories.chronologic"
                  className={
                    activeFilter === "chronological"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveFilter("thematic")}
                className={`px-4 py-2 rounded-full mr-2 ${activeFilter === "thematic" ? "bg-primary" : "bg-white dark:bg-black"}`}
              >
                <TransText
                  title="search.categories.thematic"
                  className={
                    activeFilter === "thematic"
                      ? "text-white font-medium"
                      : "text-foreground"
                  }
                />
              </TouchableOpacity>
            </LRView>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LRView>
                <TouchableOpacity
                  onPress={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full mr-2 ${
                    activeCategory === "all"
                      ? "bg-primary/10 border border-primary"
                      : "bg-white dark:bg-black"
                  }`}
                >
                  <TransText
                    title="categories.all"
                    className={
                      activeCategory === "all"
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }
                  />
                </TouchableOpacity>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    onPress={() => {
                      console.log("category and active", category.name);
                      setActiveCategory(category.name as ThematicCategories);
                    }}
                    className={`px-4 py-2 rounded-full mr-2 ${
                      activeCategory === category.name
                        ? "bg-primary/20 border border-primary"
                        : "bg-white dark:bg-black"
                    }`}
                  >
                    <TransText
                      title={`categories.${category.name}`}
                      className={
                        activeCategory === category.name
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }
                    />
                  </TouchableOpacity>
                ))}
              </LRView>
            </ScrollView>
          </View>

          {activeFilter === "chronological" && (
            <FilteredTab
              i18n={i18n}
              filteredExhibits={chronologicalCategories}
              setFilteredExhibits={setFilteredExhibits}
              exhibits={exhibits}
            />
          )}

          {activeFilter === "thematic" && (
            <FilteredTab
              i18n={i18n}
              filteredExhibits={thematicCategories}
              setFilteredExhibits={setFilteredExhibits}
              exhibits={exhibits}
            />
          )}

          {/* Recommended Exhibits (only show when no search query) */}
          {!searchQuery &&
            activeFilter === "all" &&
            activeCategory === "all" && (
              <View>
                <LRView>
                  <TransText
                    title="exhibit.recommended"
                    className="text-foreground text-lg font-semibold mb-3"
                  />
                </LRView>
                {recommendedExhibits.map((exhibit) => (
                  <SearchedExhibitCard
                    // userId={user.id}
                    key={exhibit.id}
                    item={exhibit}
                  />
                ))}
              </View>
            )}

          {/* Search Results */}
          <View>
            <LRView className="items-center justify-between mb-3 px-2">
              <TransText
                title={`search.result.${searchQuery ? "searchResult" : "allExhibits"}`}
                className="text-foreground text-lg font-semibold"
              />
              <Text className="text-gray-400">
                {filteredExhibits.length} found
              </Text>
            </LRView>

            {filteredExhibits.length > 0 ? (
              filteredExhibits.map((exhibit) => (
                <SearchedExhibitCard key={exhibit.id} item={exhibit} />
              ))
            ) : (
              <View className="bg-white dark:bg-black rounded-lg p-6 items-center">
                <Ionicons
                  name="search-outline"
                  size={50}
                  color={COLORS.light.primary}
                />
                <TransText
                  title="exhibit.notFound"
                  className="text-foreground text-lg font-medium mt-4"
                />
                <TransText
                  title="exhibit.adjustFilter"
                  className="text-gray-400 text-center mt-2"
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                    setActiveCategory("all");
                  }}
                  className="bg-primary mt-4 px-6 py-3 rounded-lg"
                >
                  <TransText
                    title="exhibit.clear"
                    className="text-white font-medium"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
