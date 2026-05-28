import React from 'react';
import { View } from 'react-native';

const StaggerContainer = ({ children }) => {
    return (
        <View>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                
                return (
                    <View>
                        {child}
                    </View>
                );
            })}
        </View>
    );
};

export default StaggerContainer;
