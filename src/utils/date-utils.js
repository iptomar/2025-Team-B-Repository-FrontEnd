const times = [
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
    "19:00", "19:30",
    "20:00", "20:30",
    "21:00", "21:30",
    "22:00", "22:30",
    "23:00", "23:30",
    "24:00"
]

export const weekdays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira" ,"Sexta-feira", "Sábado"]
export const shortened_weekdays = ["Seg", "Ter", "Qua", "Qui" ,"Sex", "Sáb"]


export function getTimeFrames(){
    const time_frames = [];
    for(let i = 0; i < times.length-1; i++){
        time_frames.push(times[i] + "-" + times[i+1])
    }
    return time_frames
}