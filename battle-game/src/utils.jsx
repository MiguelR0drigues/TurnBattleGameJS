export const getEveryQuestionForLevelOfAgeGroup = async (
  ageGroupId = 1,
  level = 1
) => {
  const response = await fetch(
    `https://europe-west2-cloud-computing-7a458.cloudfunctions.net/app/api/ageGroup/${ageGroupId}/level/${level}`
  );
  const jsonData = await response.json();
  return jsonData;
};
