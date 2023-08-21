/**
 * External dependencies
 */
import classNames from 'classnames';
import { useState, useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { CoreProfilerStateMachineContext } from '..';
import ProgressBar from '../components/progress-bar/progress-bar';
import { getLoaderStageMeta } from '../utils/get-loader-stage-meta';

export type Stage = {
	title: string;
	image?: string | JSX.Element;
	paragraphs: Array< {
		label: string;
		text: string;
		duration?: number;
		element?: JSX.Element;
	} >;
};

export type Stages = Array< Stage >;
export type LoaderContextProps = Pick<
	CoreProfilerStateMachineContext,
	'loader'
>;

export const Loader = ( { context }: { context: LoaderContextProps } ) => {
	const stages = getLoaderStageMeta( context.loader.useStages ?? 'default' );
	const currentStage = stages[ context.loader.stageIndex ?? 0 ];
	const [ currentParagraph, setCurrentParagraph ] = useState( 0 );

	useEffect( () => {
		const interval = setInterval( () => {
			setCurrentParagraph( ( _currentParagraph ) =>
				currentStage.paragraphs[ _currentParagraph + 1 ]
					? _currentParagraph + 1
					: 0
			);
		}, currentStage.paragraphs[ currentParagraph ]?.duration ?? 3000 );

		return () => clearInterval( interval );
	}, [ currentParagraph, currentStage.paragraphs ] );

	return (
		<div
			className={ classNames(
				'woocommerce-profiler-loader',
				context.loader.className
			) }
		>
			<div className="woocommerce-profiler-loader-wrapper">
				{ currentStage.image && currentStage.image }

				<h1 className="woocommerce-profiler-loader__title">
					{ currentStage.title }
				</h1>
				<ProgressBar
					className={ 'progress-bar' }
					percent={ context.loader.progress ?? 0 }
					color={ 'var(--wp-admin-theme-color)' }
					bgcolor={ '#E0E0E0' }
				/>
				<p className="woocommerce-profiler-loader__paragraph">
					<b>
						{ currentStage.paragraphs[ currentParagraph ]?.label }{ ' ' }
					</b>
					{ currentStage.paragraphs[ currentParagraph ]?.text }
					{ currentStage.paragraphs[ currentParagraph ]?.element }
				</p>
			</div>
		</div>
	);
};
