
export interface userType {
    id: string,
    user_name: string, 
    email: string,
    profile_img: string
}
    
export interface docType {
    _id: string,
    createdAt: string,
    doc_name: string,
    size : number,
    url_path : string,
    user_id : string,
    quizzesCount: number,
    flashcardsCount: number
}

export interface flashcardType {
    _id: string,
    createdAt: string,
    user_id : string,
    doc_id : {
        doc_id: string,
        doc_name: string,
    },
    questions: [{
        _id: string,
        question: string,
        answer: string,
        difficulty: string,
        reviewed: boolean, 
        favorite: boolean           
    }]
}

export interface favCardsType {
    _id: string,
    flashcard_id: string,
    question: string,
    answer: string,
    difficulty: string,
    reviewed: boolean, 
    favorite: boolean           
}

export interface QuizType {
    _id: string,
    createdAt: string,
    user_id : string,
    doc_id : {
        _id: string,
        doc_name: string,
    },
    questions: {
        _id: string,
        q: string,
        o: string[],
        c: number,
        e: string,
        selected_index: number,
    }[],
    score: number
}

export interface charMessagesType {
    _id?: string, 
    role: string,
    content: string
}

export interface  StatsType {
    documents: number
    flashcards: number
    quizzes: number
}

export interface  recentType {
    user_id: string,
    type: string,
    action: string,
    doc_id : {
        doc_id: string,
        doc_name: string,
    },
    doc_name: string,
    createdAt: string,
}