"use client"
import { FileText, Layers, BadgeQuestionMark, Clock } from 'lucide-react'
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { StatsType, recentType } from '@/lib/types'
import EmptyContent from '@/components/EmptyContent'

type propsType = {
    stats: StatsType
    recents: recentType[]
}

const RecentAndStats = ({stats, recents}: propsType) => {
    dayjs.extend(relativeTime)

    const icons = [
        {icon: FileText, bgColor: "bg-blue-500"}, 
        {icon: Layers, bgColor: "bg-pink-500"}, 
        {icon: BadgeQuestionMark, bgColor: "gradient-primary"}
    ]
    
    const formattedStats = Object.entries(stats).map(
        ([key, value], index) => ({
        title: key,
        total: value,
        icon: icons[index]
    }))

return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
            {formattedStats.map((stat) => (
            <div key={stat.title} className='flex justify-between p-4 bg-white rounded-md shadow-md'>
                <div className=''>
                    <h2>{stat.title}</h2>
                    <p className='text-xl font-bold mt-2'>{stat.total}</p>
                </div>
                <stat.icon.icon className={`button-shape text-white p-2 ${stat.icon.bgColor}`} size={32}></stat.icon.icon>
            </div>
            ))}
        </div>

        <div className='bg-white shadow-md p-5 rounded-md'>
            <div className='flex items-center gap-2 mb-5'>
                <Clock className='button-shape third-button p-1.5' size={30}></Clock>
                <h2 className='text-xl font-bold'>Recent Activity</h2>
            </div>

            {recents.length === 0 ? (
                <EmptyContent 
                    title={"No recent activity yet"} 
                    description={"Start studying and your activity will appear here"} 
                    className='mt-0 my-20'
                ></EmptyContent>
            ): (
                <div>
                    {recents.map((recent) => {
                        const messages = {
                            document: {
                                uploaded: 'Uploaded document "{name}"',
                                deleted: 'Deleted document "{name}"',
                                updated: 'Updated title of document "{name}"',
                            },
                            flashcard: {
                                generated: 'Generated flashcards from "{name}"',
                                deleted: 'Deleted flashcards from "{name}"',
                            },
                            quiz: {
                                generated: 'Generated quiz from "{name}"',
                                deleted: 'Deleted quiz from "{name}"',
                                solved: 'Completed quiz from "{name}"',
                            },
                        } as const;

                        type MessageType = keyof typeof messages;
                        type ActionType<T extends MessageType> = keyof typeof messages[T];

                        const type = recent.type as MessageType;
                        const action = recent.action as keyof typeof messages[typeof type];

                        const message = messages[type][action]
                        .replace("{name}", recent.doc_id?.doc_name || recent.doc_name);

                        return (
                        <div key={recent.createdAt} className='block bg-background border p-3 ps-6 my-2 rounded-md'>
                            <h3 className=' relative text-secondary-foreground'>
                                {message}
                                <span className='before:absolute before:w-2 before:h-2 before:bg-blue-400 before:rounded-full before:top-2 before:-left-3.5'></span>
                            </h3>
                            <p className='text-sm text-gray-500'>{new Date(recent.createdAt).toLocaleString()}</p>
                        </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
    )
}

export default RecentAndStats