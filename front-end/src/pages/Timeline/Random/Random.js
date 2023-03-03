import useRecommendation from '../../../hooks/api/useRecommendation'

import Recommendation from '../../../components/Recommendation'

export default function Random () {
  const { recommendation, updateRecommendation } = useRecommendation()

  const handleUpdate = () => {
    updateRecommendation(recommendation.id)
  }

  if (!recommendation) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <div>Loading...</div>
  }

  // eslint-disable-next-line react/react-in-jsx-scope
  return <Recommendation {...recommendation} onUpvote={handleUpdate} onDownvote={handleUpdate} />
}
