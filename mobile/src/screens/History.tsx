import { useCallback, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Heading, Text, VStack, useToast } from '@gluestack-ui/themed';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';
import { ToastMessage } from '@components/ToastMessage';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { Loading } from '@components/Loading';
import { tagWeeklyExercisesAmount } from '@notifications/notificationsTags';

type RouteParamsProps = {
  createWeekExercisesAmount?: boolean
}

export function History() {
  const route = useRoute();
  const params = route.params as RouteParamsProps

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get('/history');
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        )
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    },[])
  );

  useEffect(() => {
    if (params?.createWeekExercisesAmount && exercises) {
      const amount = exercises.flatMap((day) => {
        const days = day.data.filter(
          (exercise) =>
            new Date(exercise.created_at).getMonth() === new Date().getMonth(),
        )
        return days
      }).length

      tagWeeklyExercisesAmount(amount)
    }
  }, [exercises, params]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? <Loading /> : (
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <HistoryCard data={item} /> }
          renderSectionHeader={({ section }) => (
            <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text color="$gray200" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer execícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}