import { useLocalSearchParams } from "expo-router";
import { Screen, ResourceState } from "../../components/Screen";
import ProjectForm from "../../components/ProjectForm";
import { useResource } from "../../hooks/useResource";
export default function EditProject() {
  const { id } = useLocalSearchParams();
  const resource = useResource("/projects/" + id);
  return (
    <Screen title="Edit Project">
      <ResourceState resource={resource} />
      {resource.data?.my_role === "owner" && (
        <ProjectForm key={resource.data.id} project={resource.data} />
      )}
    </Screen>
  );
}
