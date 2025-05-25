import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../constants/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { AlertType, useAlert } from "../../context/alertContext";
import { saveReminder } from "../../services/reminderService";
import { schedulePushNotification } from "../../services/notificationService";

const EventScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [reminderText, setReminderText] = useState("");

  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { showAlert } = useAlert();

  const handleSetReminder = async () => {
    if (!selectedDate) {
      showAlert(t("error"), t("errorSelectDate"), AlertType.ERROR);
      return;
    }

    if (!eventType) {
      showAlert(t("error"), t("errorSelectEventType"), AlertType.ERROR);
      return;
    }

    if (!reminderText) {
      showAlert(t("error"), t("errorEnterReminderText"), AlertType.ERROR);
      return;
    }

    const data = {
      date: selectedDate,
      type: eventType,
      text: reminderText,
    };
    console.log(data);
    const [year, month, day] = selectedDate.split("-");
    const fullDate = `${year}-${month}-${day}T09:00:00`;

    try {
      await saveReminder(data);
      await schedulePushNotification(fullDate, reminderText);
      showAlert(
          t("success"),
          t("reminderCreatedSuccess"),
          AlertType.SUCCESS,
      );
      resetForm();
    } catch (error) {
      console.error("Error saving reminder:", error);
      showAlert(
          t("error"),
          t("errorCreatingReminder"),
          AlertType.ERROR,
      );
    }
    navigation.goBack();
  };

  const resetForm = () => {
    setEventType("");
    setReminderText("");
  };

  const eventIcons = {
    birthday: "cake",
    appointment: "event-note",
    celebration: "celebration",
    other: "event",
  };

  const getEventTypeName = (type: any) => {
    switch (type) {
      case "birthday":
        return t("eventTypes.birthday");
      case "appointment":
        return t("eventTypes.appointment");
      case "celebration":
        return t("eventTypes.celebration");
      case "other":
        return t("eventTypes.other");
      default:
        return "";
    }
  };

  const getEventTypeIcon = (type: string) => {
    return eventIcons[type as keyof typeof eventIcons] || "event";
  };

  // Get current locale from i18n
  const currentLocale = i18n.language || "vi-VN";

  const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString(currentLocale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "";

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
          >
            <IonIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("createReminderEvent")}</Text>
        </View>

        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Date Selection Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="date-range" size={22} color={Colors.primary} />
                <Text style={styles.sectionTitle}>{t("selectDate")}</Text>
              </View>

              <Calendar
                  onDayPress={(day: { dateString: string }) =>
                      setSelectedDate(day.dateString)
                  }
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      selectedColor: Colors.primary,
                      selectedTextColor: "#FFF",
                    },
                  }}
                  style={styles.calendar}
                  theme={{
                    todayTextColor: Colors.primary,
                    arrowColor: Colors.primary,
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "500",
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    "stylesheet.calendar.header": {
                      monthText: {
                        fontSize: 16,
                        fontWeight: "bold",
                        color: Colors.primary,
                      },
                    },
                  }}
              />

              {selectedDate && (
                  <View style={styles.selectedDateContainer}>
                    <Icon name="event" size={18} color={Colors.primary} />
                    <Text style={styles.selectedDateText}>{formattedDate}</Text>
                  </View>
              )}
            </View>

            {/* Event Type Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="category" size={22} color={Colors.primary} />
                <Text style={styles.sectionTitle}>{t("eventType")}</Text>
              </View>

              <View style={styles.eventTypeSelector}>
                {Object.keys(eventIcons).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                          styles.eventTypeButton,
                          eventType === type && styles.selectedEventTypeButton,
                        ]}
                        onPress={() => setEventType(type)}
                    >
                      <Icon
                          name={getEventTypeIcon(type)}
                          size={26}
                          color={eventType === type ? "#FFF" : Colors.primary}
                          style={styles.eventTypeIcon}
                      />
                      <Text
                          style={[
                            styles.eventTypeText,
                            eventType === type && styles.selectedEventTypeText,
                          ]}
                      >
                        {getEventTypeName(type)}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reminder Content Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="notifications" size={22} color={Colors.primary} />
                <Text style={styles.sectionTitle}>{t("reminderContent")}</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("enterReminderDetails")}
                    value={reminderText}
                    onChangeText={setReminderText}
                    multiline
                    placeholderTextColor="#999"
                    maxLength={200}
                />
                <Text style={styles.charCount}>{reminderText.length}/200</Text>
              </View>
            </View>

            {/* Preview Card */}
            {selectedDate && eventType && reminderText ? (
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Icon name="visibility" size={22} color={Colors.primary} />
                    <Text style={styles.previewTitle}>{t("preview")}</Text>
                  </View>

                  <View style={styles.previewContent}>
                    <View style={styles.previewIcon}>
                      <Icon
                          name={getEventTypeIcon(eventType)}
                          size={36}
                          color="#FFF"
                      />
                    </View>

                    <View style={styles.previewDetails}>
                      <Text style={styles.previewEventType}>
                        {getEventTypeName(eventType)}
                      </Text>
                      <Text style={styles.previewDate}>{formattedDate}</Text>
                      <Text style={styles.previewText} numberOfLines={2}>
                        {reminderText}
                      </Text>
                    </View>
                  </View>
                </View>
            ) : null}

            {/* Set Reminder Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleSetReminder}
                activeOpacity={0.8}
            >
              <Icon name="notifications-active" size={24} color="#FFF" />
              <Text style={styles.buttonText}>{t("setNotification")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  calendar: {
    borderRadius: 12,
    elevation: 0,
    borderWidth: 0,
    marginBottom: 10,
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  selectedDateText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  eventTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  eventTypeButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedEventTypeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  eventTypeIcon: {
    marginRight: 10,
  },
  eventTypeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  selectedEventTypeText: {
    color: "#FFF",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 120,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    paddingBottom: 30,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FAFAFA",
    textAlignVertical: "top",
  },
  charCount: {
    position: "absolute",
    bottom: 8,
    right: 14,
    fontSize: 12,
    color: "#888",
  },
  previewCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  previewContent: {
    flexDirection: "row",
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  previewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  previewDetails: {
    flex: 1,
  },
  previewEventType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EventScreen;