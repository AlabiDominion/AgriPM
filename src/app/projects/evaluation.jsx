import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { Card, money, ResourceState, Screen } from "../../components/Screen";
export default function Evaluation() {
  const { id } = useLocalSearchParams();
  const resource = useResource("/projects/" + id + "/evaluation");
  const data = resource.data;
  return (
    <Screen title="Evaluation Summary">
      <ResourceState resource={resource} />
      {data && (
        <>
          <Card>
            <Text className="mb-4 text-lg font-bold text-forest">
              Planned vs actual spending
            </Text>
            <Text className="text-base leading-8 text-stone-600">
              Planned: {money(data.planned_budget)}
              {"\n"}Actual: {money(data.actual_spending)}
              {"\n"}
              {data.variance < 0 ? "Over budget" : "Under budget"}:{" "}
              {money(Math.abs(data.variance))}
            </Text>
          </Card>
          <Card>
            <Text className="mb-3 text-lg font-bold text-forest">
              Tasks & timing
            </Text>
            <Text className="text-base leading-8 text-stone-600">
              {data.completion_percentage}% complete{"\n"}
              {data.completed_tasks} / {data.total_tasks} tasks finished{"\n"}
              {data.delayed_tasks} delayed tasks{"\n"}Planned duration:{" "}
              {data.planned_days} days{"\n"}Actual duration: {data.actual_days}{" "}
              days
            </Text>
          </Card>
          <Card>
            <Text className="mb-3 text-lg font-bold text-forest">Risks</Text>
            <Text className="text-base text-stone-600">
              {data.risks_encountered} encountered · {data.risks_resolved}{" "}
              resolved
            </Text>
          </Card>
          <Card>
            <Text className="mb-3 text-lg font-bold text-forest">
              Objectives
            </Text>
            {data.objectives.map((item, i) => (
              <Text key={i} className="mb-3 text-sm leading-6 text-stone-600">
                {item.achieved ? "✓ Achieved" : "Not achieved"}: {item.text}
              </Text>
            ))}
          </Card>
          {Boolean(data.closing_notes) && (
            <Card>
              <Text className="mb-2 font-bold text-forest">Closing notes</Text>
              <Text className="text-sm leading-6 text-stone-600">
                {data.closing_notes}
              </Text>
            </Card>
          )}
          <Text className="text-xs text-stone-400">
            Snapshot generated {data.completed_at.slice(0, 10)}. Reopening
            removes this snapshot.
          </Text>
        </>
      )}
    </Screen>
  );
}
