#!/usr/bin/env python3
import argparse
import json


def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate meeting-problem animation frames")
    parser.add_argument("--mode", type=str, choices=["meeting", "chase"], default="meeting")
    parser.add_argument("--distance", type=float, required=True)
    parser.add_argument("--speed-a", type=float, required=True)
    parser.add_argument("--speed-b", type=float, required=True)
    parser.add_argument("--frame-count", type=int, default=90)
    args = parser.parse_args()

    mode = args.mode
    distance = clamp(args.distance, 60.0, 300.0)
    speed_a = clamp(args.speed_a, 1.0, 12.0)
    speed_b = clamp(args.speed_b, 1.0, 12.0)
    frame_count = int(clamp(float(args.frame_count), 20.0, 240.0))

    if mode == "meeting":
        meet_time = distance / (speed_a + speed_b)
        simulation_duration = meet_time * 1.6
        axis_max = distance
    else:
        if speed_a <= speed_b:
            raise ValueError("For chase mode, speedA must be greater than speedB")
        meet_time = distance / (speed_a - speed_b)
        simulation_duration = meet_time * 1.6
        axis_max = max(speed_a * simulation_duration, distance + speed_b * simulation_duration)

    frames = []
    for idx in range(frame_count):
        t = simulation_duration * idx / max(1, frame_count - 1)
        if mode == "meeting":
            pos_a = min(distance, speed_a * t)
            pos_b = max(0.0, distance - speed_b * t)
            met = t >= meet_time
        else:
            pos_a = speed_a * t
            pos_b = distance + speed_b * t
            met = pos_a >= pos_b
        frames.append(
            {
                "t": round(t, 4),
                "posA": round(pos_a, 4),
                "posB": round(pos_b, 4),
                "met": met,
            }
        )

    result = {
        "mode": mode,
        "meetTime": round(meet_time, 4),
        "simulationDuration": round(simulation_duration, 4),
        "axisMax": round(axis_max, 4),
        "frames": frames,
    }
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
