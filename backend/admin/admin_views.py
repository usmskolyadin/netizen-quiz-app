from fastadmin import register, SqlAlchemyModelAdmin
from db.quizes import Quiz, QuizCategory, Question, Answer, QuizResult, ScoreRating
from db.users import User

@register(Quiz)
class QuizAdmin(SqlAlchemyModelAdmin):
    inline_models = [QuizCategory, Question, ScoreRating] 

@register(QuizCategory)
class QuizCategoryAdmin(SqlAlchemyModelAdmin):
    pass

@register(Question)
class QuestionAdmin(SqlAlchemyModelAdmin):
    inline_models = [Answer]

@register(Answer)
class AnswerAdmin(SqlAlchemyModelAdmin):
    pass

@register(QuizResult)
class QuizResultAdmin(SqlAlchemyModelAdmin):
    pass

@register(ScoreRating)
class ScoreRatingAdmin(SqlAlchemyModelAdmin):
    pass

@register(User)
class UserAdmin(SqlAlchemyModelAdmin):
    pass
