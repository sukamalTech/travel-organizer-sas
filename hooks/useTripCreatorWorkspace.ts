"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getTripItineraryDays,
  createItineraryDay,
  updateItineraryDayDetails,
  updateItineraryDayDate,
  reorderItineraryDays,
  deleteItineraryDay,
} from "@/app/actions/itineraryDays";
import {
  fetchTripOthersDetails,
  saveTripOthersDetail,
  deleteTripOthersDetail,
} from "@/lib/itinerary/othersDetailsClient";
import {
  ExtendedItineraryDay,
  DayFormInput,
} from "@/components/creator/DaysTimelinePane";
import { ActiveTabType } from "@/components/creator/OthersFormPanel";
export interface DayLogisticsSummary {
  legs: number;
  stays: number;
  attractions: number;
  dining: number;
}

export function useTripCreatorWorkspace(tripId: string) {
  const supabase = createClient();

  const [days, setDays] = useState<ExtendedItineraryDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [legsCountByDayId, setLegsCountByDayId] = useState<
    Record<string, number>
  >({});

  const [activeTab, setActiveTab] = useState<ActiveTabType>("accommodation");
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [diningSpots, setDiningSpots] = useState<any[]>([]);
  const [legs, setLegs] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [mobileView, setMobileView] = useState<"days" | "list" | "form">(
    "days",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDay, setIsCreatingDay] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recompute per-day leg counts whenever legs state changes
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const leg of legs) {
      const dId = leg?.dayId ?? leg?.day_id;
      if (dId) {
        counts[dId] = (counts[dId] || 0) + 1;
      }
    }
    setLegsCountByDayId(counts);
  }, [legs]);

  // Single load path for itinerary days (runs once per tripId)
  useEffect(() => {
    if (!tripId) return;
    let cancelled = false;

    async function loadDays() {
      try {
        const daysData = await getTripItineraryDays(tripId);
        if (cancelled) return;

        const typedDays = (daysData || []) as ExtendedItineraryDay[];
        setDays(typedDays);

        // Ensure a valid day is selected on initial load or hard refresh
        if (typedDays.length > 0) {
          setSelectedDayId((prev) =>
            prev && typedDays.some((d) => d.id === prev)
              ? prev
              : typedDays[0].id,
          );
        } else {
          setSelectedDayId(null);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error("Error loading itinerary days:", err);
        setErrorMessage(err.message || "Failed to load itinerary dates.");
      }
    }

    loadDays();
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const refreshOthersDetails = useCallback(
    async (dayId: string | null = selectedDayId) => {
      if (!tripId) return;
      try {
        const data = await fetchTripOthersDetails(tripId, dayId);
        setAccommodations(data.accommodations);
        setAttractions(data.attractions);
        setDiningSpots(data.diningSpots);
        setLegs(data.travelLegs);
      } catch (err: any) {
        console.error("Error fetching logistics details:", err);
        setErrorMessage(err.message || "Failed to load logistics details.");
      }
    },
    [tripId, selectedDayId],
  );

  // Refresh logistics whenever tripId or selectedDayId changes
  useEffect(() => {
    if (!tripId) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchTripOthersDetails(tripId, selectedDayId);
        if (cancelled) return;
        setAccommodations(data.accommodations);
        setAttractions(data.attractions);
        setDiningSpots(data.diningSpots);
        setLegs(data.travelLegs);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Error syncing logistics details:", err);
        setErrorMessage(err.message || "Failed to load logistics details.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tripId, selectedDayId]);

  // Day selection & mobile navigation
  const handleSelectDay = useCallback((day: ExtendedItineraryDay) => {
    setSelectedDayId(day.id);
    setSelectedItem(null);
    setMobileView("list");
  }, []);

  const handleReorderDays = useCallback(
    async (reorderedDays: ExtendedItineraryDay[]) => {
      setDays(reorderedDays);
      try {
        await reorderItineraryDays(
          reorderedDays.map((d) => ({
            id: d.id,
            day_number: d.day_number,
            date: d.date,
          })),
        );
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to reorder dates.");
      }
    },
    [],
  );

  const handleSyncSubsequentDates = useCallback(
    async (recalculatedDays: ExtendedItineraryDay[]) => {
      setDays(recalculatedDays);
      try {
        await reorderItineraryDays(
          recalculatedDays.map((d) => ({
            id: d.id,
            day_number: d.day_number,
            date: d.date,
          })),
        );
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to sync dates.");
      }
    },
    [],
  );

  const handleCreateDaySubmit = useCallback(
    async (input: DayFormInput) => {
      setIsCreatingDay(true);
      setErrorMessage(null);
      const nextDayNumber = days.length + 1;

      try {
        const newDay = await createItineraryDay({
          tripId,
          dayNumber: nextDayNumber,
          date: input.date,
          summary: input.nightStayLocation || `Day ${nextDayNumber}`,
        });

        await updateItineraryDayDetails(newDay.id, {
          nightStayLocation: input.nightStayLocation || null,
          nightStayNotes: input.nightStayNotes || null,
          dailyNotes: input.dailyNotes || "",
        });

        const createdTyped: ExtendedItineraryDay = {
          ...newDay,
          night_stay_location: input.nightStayLocation || null,
          night_stay_notes: input.nightStayNotes || null,
          daily_notes: input.dailyNotes || "",
        };

        setDays((prev) => [...prev, createdTyped]);
        setSelectedDayId(createdTyped.id);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to create date.");
      } finally {
        setIsCreatingDay(false);
      }
    },
    [days.length, tripId],
  );

  const handleUpdateDaySubmit = useCallback(async (input: DayFormInput) => {
    if (!input.id) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await updateItineraryDayDate(input.id, input.date);
      await updateItineraryDayDetails(input.id, {
        nightStayLocation: input.nightStayLocation || null,
        nightStayNotes: input.nightStayNotes || null,
        dailyNotes: input.dailyNotes || "",
      });

      setDays((prev) =>
        prev.map((d) =>
          d.id === input.id
            ? {
                ...d,
                date: input.date,
                night_stay_location: input.nightStayLocation || null,
                night_stay_notes: input.nightStayNotes || null,
                daily_notes: input.dailyNotes || "",
              }
            : d,
        ),
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update date.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleDeleteDay = useCallback(
    async (dayId: string) => {
      setErrorMessage(null);
      const remaining = days
        .filter((d) => d.id !== dayId)
        .map((d, idx) => ({ ...d, day_number: idx + 1 }));

      try {
        await supabase.from("travel_legs").delete().eq("day_id", dayId);
        await deleteItineraryDay(
          dayId,
          remaining.map((d) => ({ id: d.id, day_number: d.day_number })),
        );

        setDays(remaining);
        setSelectedDayId((prev) =>
          prev === dayId ? (remaining[0]?.id ?? null) : prev,
        );
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to delete date.");
      }
    },
    [days, supabase],
  );

  // Logistics CRUD handlers
  const handleSaveItem = useCallback(
    async (formData: any) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        await saveTripOthersDetail({
          tripId,
          dayId: selectedDayId,
          type: activeTab,
          formData,
          existingId: selectedItem?.id,
        });

        setSuccessMessage("Successfully saved record!");
        setSelectedItem(null);
        await refreshOthersDetails(selectedDayId);
        setTimeout(() => setSuccessMessage(null), 3000);
        setMobileView("list");
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [tripId, selectedDayId, activeTab, selectedItem, refreshOthersDetails],
  );

  const handleDeleteItem = useCallback(
    async (itemId: string, type: ActiveTabType) => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      try {
        await deleteTripOthersDetail(tripId, itemId, type);
        await refreshOthersDetails(selectedDayId);
        if (selectedItem?.id === itemId) setSelectedItem(null);
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    },
    [tripId, selectedDayId, selectedItem, refreshOthersDetails],
  );

  return {
    days,
    selectedDayId,
    legsCountByDayId,
    activeTab,
    setActiveTab,
    accommodations,
    attractions,
    diningSpots,
    legs,
    selectedItem,
    setSelectedItem,
    mobileView,
    setMobileView,
    isSubmitting,
    isCreatingDay,
    errorMessage,
    successMessage,
    handleSelectDay,
    handleReorderDays,
    handleSyncSubsequentDates,
    handleCreateDaySubmit,
    handleUpdateDaySubmit,
    handleDeleteDay,
    handleSaveItem,
    handleDeleteItem,
  };
}
