import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Path } from 'react-native-svg';
import type { WaveformData } from '../types/audioEffects.types';

interface AudioWaveformDisplayProps {
  audioId: string;
  duration: number;
  color?: string;
  height?: number;
  generateWaveform?: (audioId: string) => WaveformData | Promise<WaveformData>;
  cropStart?: number;
  cropEnd?: number;
}

const AudioWaveformDisplay: React.FC<AudioWaveformDisplayProps> = ({
  audioId,
  duration,
  color = '#3b82f6',
  height = 40,
  generateWaveform,
  cropStart = 0,
  cropEnd,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const [waveformData, setWaveformData] = React.useState<number[]>([]);

  // Generate mock waveform data
  const generateMockWaveform = () => {
    const samples = 100; // Number of bars to display
    const mockData: number[] = [];

    for (let i = 0; i < samples; i++) {
      // Create a pseudo-random but consistent waveform
      const frequency = Math.sin((i / samples) * Math.PI * 4) * 0.5 + 0.5;
      const randomness = Math.sin(i * 12.9898) * 0.43758 + 0.5;
      const amplitude = frequency * randomness;
      mockData.push(amplitude * 100);
    }

    return mockData;
  };

  useEffect(() => {
    if (generateWaveform) {
      const result = generateWaveform(audioId);
      if (result instanceof Promise) {
        result.then((data) => setWaveformData(data.samples));
      } else {
        setWaveformData(result.samples);
      }
    } else {
      setWaveformData(generateMockWaveform());
    }
  }, [audioId, generateWaveform]);

  // Calculate bar positions and heights
  const bars = useMemo(() => {
    const barCount = 50; // Number of bars to display
    const barWidth = (screenWidth - 32) / barCount;
    const spacing = 2;

    return waveformData.slice(0, barCount).map((sample, index) => ({
      x: 16 + index * barWidth,
      height: (sample / 100) * (height - 8),
      width: barWidth - spacing,
    }));
  }, [waveformData, height, screenWidth]);

  // Calculate crop region
  const cropStartPixel = cropStart ? (cropStart / duration) * (screenWidth - 32) : 0;
  const cropEndPixel = cropEnd ? (cropEnd / duration) * (screenWidth - 32) : screenWidth - 32;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={screenWidth} height={height} viewBox={`0 0 ${screenWidth} ${height}`}>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={screenWidth}
          height={height}
          fill="#111827"
        />

        {/* Waveform bars */}
        {bars.map((bar, index) => {
          const isCropped =
            (cropStart && bar.x < cropStartPixel + 16) ||
            (cropEnd && bar.x > cropEndPixel + 16);

          return (
            <Rect
              key={index}
              x={bar.x}
              y={(height - bar.height) / 2}
              width={bar.width}
              height={bar.height}
              fill={isCropped ? '#4b5563' : color}
              opacity={isCropped ? 0.5 : 1}
            />
          );
        })}

        {/* Crop indicators */}
        {cropStart > 0 && (
          <>
            {/* Left crop line */}
            <Line
              x1={cropStartPixel + 16}
              y1={0}
              x2={cropStartPixel + 16}
              y2={height}
              stroke="#ff6b6b"
              strokeWidth="2"
            />
            {/* Left crop background */}
            <Rect
              x={0}
              y={0}
              width={cropStartPixel + 16}
              height={height}
              fill="#1f2937"
              opacity={0.5}
            />
          </>
        )}

        {cropEnd && cropEnd < duration && (
          <>
            {/* Right crop line */}
            <Line
              x1={cropEndPixel + 16}
              y1={0}
              x2={cropEndPixel + 16}
              y2={height}
              stroke="#ff6b6b"
              strokeWidth="2"
            />
            {/* Right crop background */}
            <Rect
              x={cropEndPixel + 16}
              y={0}
              width={screenWidth - (cropEndPixel + 16)}
              height={height}
              fill="#1f2937"
              opacity={0.5}
            />
          </>
        )}

        {/* Duration time labels */}
        <text
          x="16"
          y={height - 2}
          fontSize="10"
          fill="#9ca3af"
          textAnchor="start"
        >
          0s
        </text>
        <text
          x={screenWidth - 16}
          y={height - 2}
          fontSize="10"
          fill="#9ca3af"
          textAnchor="end"
        >
          {duration.toFixed(1)}s
        </text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#111827',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
});

export default AudioWaveformDisplay;
