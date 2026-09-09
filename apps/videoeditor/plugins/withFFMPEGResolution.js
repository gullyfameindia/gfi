const { withProjectBuildGradle } = require("@expo/config-plugins");
const withFFmpegResolution = (config) => {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addFFmpegResolution(
                config.modResults.contents,
            );
        }
        return config;
    });
};
function addFFmpegResolution(buildGradle) {
    const ffmpeg = `
subprojects {
        project.configurations.all {
        resolutionStrategy.eachDependency { details ->
            if (details.requested.group == 'com.arthenica' && details.requested.name.contains('ffmpeg-kit')) {
                // Use the stable, pre-compiled Maven Central version
                details.useTarget "com.moizhassan.ffmpeg:ffmpeg-kit-16kb:6.1.1"
            }
        }
    }
}
    `;
    if (buildGradle.includes("com.moizhassan.ffmpeg:ffmpeg-kit-16kb")) {
        return buildGradle;
    }
    return buildGradle + ffmpeg;
}
module.exports = withFFmpegResolution;
