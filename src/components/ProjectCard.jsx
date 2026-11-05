import { Image, Pressable, Text, View } from "react-native";
import { ProgressBar, StatusBadge } from "./ui";
export function projectImage(type) {
  return type === "poultry" || type === "livestock"
    ? require("../../assets/images/farms/poultry-farm.png")
    : require("../../assets/images/farms/maize-field.png");
}
export default function ProjectCard({ project, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${project.name}, ${project.progress}% complete`}
      className="mb-4 rounded-3xl border border-stone-200 bg-white p-4 active:opacity-70"
    >
      <View className="flex-row items-start gap-4">
        <Image
          source={projectImage(project.project_type)}
          style={{ width: 86, height: 108, borderRadius: 14 }}
          resizeMode="cover"
        />
        <View className="flex-1 gap-2">
          <StatusBadge status={project.status} />
          <Text className="text-lg font-bold text-forest">{project.name}</Text>
          <Text className="text-xs text-stone-500">
            {project.measurement_value} {project.measurement_unit}
          </Text>
          <Text className="text-xs capitalize text-stone-400">
            {project.my_role}
          </Text>
        </View>
      </View>
      <View className="mb-2 mt-5 flex-row justify-between">
        <Text className="text-xs text-stone-500">Task progress</Text>
        <Text className="text-xs font-bold text-forest">
          {project.progress}%
        </Text>
      </View>
      <ProgressBar value={project.progress} />
      <View className="mt-3 flex-row flex-wrap justify-between gap-2">
        <Text className="text-xs text-stone-500">
          {project.completed_tasks} of {project.total_tasks} tasks completed
        </Text>
        <Text className="text-xs text-stone-500">
          {project.expected_end_date}
        </Text>
      </View>
    </Pressable>
  );
}
