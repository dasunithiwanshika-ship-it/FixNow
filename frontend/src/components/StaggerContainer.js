import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

const StaggerContainer = ({ children, delay = 0, staggerBase = 100 }) => {
    return (
        <View>
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;
                
                return (
                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 400,
                            delay: delay + (index * staggerBase),
                        }}
                    >
                        {child}
                    </MotiView>
                );
            })}
        </View>
    );
};

export default StaggerContainer;
