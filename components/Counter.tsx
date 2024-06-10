import { trpc } from "@trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Counter() {
  const { counter } = trpc;

  const queryClient = useQueryClient();
  const queryKey = counter.getCount.getQueryKey();
  const { data } = counter.getCount.useQuery();
  const incrementCountMutation = counter.incrementCount.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
  const setCountMutation = counter.setCount.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  if (data === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Count {data}</p>
      <button onClick={() => incrementCountMutation.mutate()}>Increment by one</button>
      <button onClick={() => setCountMutation.mutate({ newCount: 1 })}>Reset to one</button>
    </div>
  );
}
